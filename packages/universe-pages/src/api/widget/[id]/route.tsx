import { getCreditById, getInitiativeById } from '@/utils/registry'

function parseHtml(data){
  const html = `
    <html>
      <head>
        <style>
          * { box-sizing: border-box; }
          html,body { margin: 0; padding: 0; font: normal 1em sans-serif; }
          body { width: 350px; height: 350px; border: 1px solid #ccc; border-radius: 8px; }
          h1, h2, h3 { margin: 0; padding: 0; font-weight: 200; }
          top { display: block; padding: 10px 20px; text-align: center; background-color: #284; border-radius: 8px 8px 0 0; }
          top h1 { color: #fff; }
          top h2 { color: #bdf; font-size: 1em; }
          med { display: flex; flex-direction: row; justify-content: space-around; align-items: center; margin-top: 20px; }
          med li { list-style: none; width: 100%; }
          med li:first-child { border-right: 1px solid #ccc; }
          med li div { text-align: center; }
          med li div:nth-child(1) { color:red; }
          med li div:nth-child(2) { font-size: 3em; }
          med li div:nth-child(3) { font-size: 0.8em; }
          bot { display: block; padding: 20px; }
          bot bar { display: block; width: 310px; background-color: #ccc; border-radius: 10px; }
          bot bar div { width: ${data.width}px; padding: 6px; color: #fff; background-color: #284; text-align: center; border-radius: 10px; }
          inf { display: block; text-align: center; }
          inf a { display: block; width: 160px; margin: 15px auto 0; padding: 10px 20px; background-color: #1c64f2; color: #fff; border-radius: 10px; text-decoration: none; }
        </style>
      </head>
      <body>
        <div>
          <top>
            <h1>${data.organization}</h1>
            <h2>${data.initiative}</h2>
          </top>
          <med>
            <li><div>Goal   </div><div>${data.goal}</div><div>tons/carbon</div></li>
            <li><div>Current</div><div>${data.current}</div><div>tons/carbon</div></li>
          </med>
          <bot>
            <bar>
              <div>${data.percent}%</div>
            </bar>
          </bot>
          <inf>
            <div>Donate to help us achieve that goal</div>
            <a href="${data.url}" target="_blank">DONATE</a>
          </inf>
        </div>
      </body>
    </html>
  `
  return html
}

function NotFound(url){
  const data = {
    id: '',
    organization: 'Carbon Widget',
    initiative: 'Initiative not found',
    goal: 0,
    current: 0,
    percent: 0,
    width: 0,
    url
  }
  const html = parseHtml(data)
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}

export async function GET(request:Request, context:any) {
  const id = context?.params?.id || ''
  const requrl = new URL(request.url)
  const credit = await getCreditById(id)
  if(!credit){ return NotFound(requrl.origin) }
  const initiative = await getInitiativeById(credit?.initiativeId)
  if(!initiative){ return NotFound(requrl.origin) }
  const url = requrl.origin+'/initiatives/'+initiative.id
  //console.log(credit)
  //console.log(initiative)
  const percent = ((credit?.current * 100 / credit?.goal) || 0).toFixed(0)
  const width = Math.min((310 * parseFloat(percent) / 100), 310)
  const data = {
    id: initiative.id,
    organization: initiative.organization.name,
    initiative: initiative.title + ' Initiative',
    goal: credit.goal||0,
    current: credit.current||0,
    percent,
    width,
    url
  }
  console.log(data)
  const html = parseHtml(data)
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}