import { updateCredit } from "@cfce/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("BODY", body)
    const res = await updateCredit(body.id, body.data)
    console.log("RES", res)
    return Response.json(res)
  } catch (ex) {
    console.error(ex)
    if (ex instanceof Error) {
      return Response.json(
        { success: false, error: ex.message },
        { status: 500 },
      )
    }
    return Response.json(
      { success: false, error: "Error updating credit" },
      { status: 500 },
    )
  }
}
