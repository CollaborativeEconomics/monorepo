# WIP: This script is a work in progress and may not work as expected.
def parse_copy_data(sql_file):
    with open(sql_file, 'r') as file:
        lines = file.readlines()

    copy_data = {}
    table_name = ""
    columns = []
    in_copy = False
    data_lines = []
    blacklist = ['_prisma_migrations']

    for line in lines:
        line = line.strip()
        if line.startswith('COPY'):
          if any(table in line for table in blacklist):
            continue
          else:
            if in_copy:  # previous table ends here
                copy_data[table_name] = {'columns': columns, 'data': data_lines}
                data_lines = []
            in_copy = True
            parts = line.split()
            table_name = parts[1].split('.')[1]  # assuming 'public.tablename' format
            # Extract columns
            columns = line[line.find("(")+1:line.find(")")].split(', ')
            continue
        elif line == '\\.':
            in_copy = False
            copy_data[table_name] = {'columns': columns, 'data': data_lines}
            data_lines = []
            table_name = ""
            columns = []
        elif in_copy:
            data_lines.append(line)

    return copy_data

def generate_prisma_seed_script(copy_data, output_file):
    with open(output_file, 'w') as js_file:
        js_file.write("import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\nasync function main() {\n")
        
        for table, info in copy_data.items():
            columns = info['columns']
            for row in info['data']:
                values = row.split('\t')
                fields = ',\n    '.join(f'{col}: "{val}"' for col, val in zip(columns, values))
                js_file.write(f"  await prisma.{table}.create({{\n    data: {{\n    {fields}\n    }}\n  }});\n")
        
        js_file.write("  console.log('Data seeded successfully.');\n}\n\nmain()\n  .then(async () => {\n    await prisma.$disconnect();\n  })\n  .catch(async (e) => {\n    console.error(e);\n    await prisma.$disconnect();\n    process.exit(1);\n  });\n")

def main():
    sql_file = input("Enter the path to your SQL dump file: ")
    # Remove any single or double quotes that may surround the file path
    sql_file = sql_file.strip("\"'")
    output_file = 'seed.ts'
    copy_data = parse_copy_data(sql_file)
    generate_prisma_seed_script(copy_data, output_file)
    print("Prisma seed script generated successfully in TypeScript.")

if __name__ == "__main__":
    main()
