import Image from 'next/image';
import Link from 'next/link';
import { getRecentStories, getCreditsByInitiative } from '@/src/utils/registry';
import CarbonChart from '../components/carbonchart';

export default async function Home(props: any) {
  const appMode = process.env.NODE_ENV || 'development';
  console.log(`App running in ${appMode} mode`);
  const initid = process.env.FEATURED_INITIATIVE;
  const featured = '/initiatives/'+initid;
  let stories = await getRecentStories(4);
  if (stories?.error) {
    stories = null;
  }

  // Chart data
  const credits = await getCreditsByInitiative(initid);
  const credit = credits?.length > 0 ? credits[0] : null;
  const goal = 100
  //let goal = credit?.goal || 1;
  //if(goal > 100){ goal = 100 }
  const tons = 173.243
  const tonx = parseFloat(credit?.current) / parseFloat(credit?.value)
  const perc = tonx * 100 / tons
  console.log('TONS', tons, tonx, perc, '%')
  const current = Math.floor(parseFloat(credit?.current) / parseFloat(credit?.goal) * 100) || 0;
  //const current = credit?.current || 0;
  const percent = ((current * 100) / goal)
  //console.log('CREDIT', credit);
  console.log('CHART', goal, current, percent, '%');
  const date = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="w-full h-screen">
        <ParallaxHero />

        {/* HERO */}
        <div className="relative">
          <div className="flex flex-col bg-[url('/newui/bg.jpg')] bg-bottom bg-cover bg-no-repeat shadow-lg">
            {/* INTRO */}
            <div className="flex flex-col p-12 lg:p-20 pt-16 bg-gradient-to-b from-50% from-white to-transparent">
              {/* title */}
              <h1 className="text-3xl tracking-tight lg:text-4xl text-slate-400 bold">
                FEATURED PROJECT
              </h1>
              {/* text */}
              <div className="flex flex-col lg:flex-row justify-center items-center text-slate-900">
                <Image
                  src="/newui/logoleaf.png"
                  width={384}
                  height={384}
                  alt="Stellar green"
                  // className="aspect-square"
                />
                <div>
                  <h2 className="mt-6 mb-4 text-4xl font-bold">
                    Towards a Carbon-Neutral Stellar Blockchain
                  </h2>
                  <p className="py-3">
                    We have partnered with Public Node and Stellar Carbon to
                    allow XLM holders to help make Stellar a carbon-neutral
                    chain
                  </p>
                  <p className="py-3">
                    When you make a donation to Public Node (a registered 501C3
                    non-profit), Soroban smart contracts automatically allocate
                    funds into chunks to purchase carbon credits, and you
                    receive a receipt NFT showing the estimated offset
                  </p>
                  <p className="py-3">
                    Once the carbon credit has been retired, an NFT showing the
                    number of credits retired is minted
                  </p>
                  <div className="grid gap-6 p-6">
                    <Image
                      src="/newui/stellarcarbon.png"
                      width={250}
                      height={100}
                      alt="Stellar Carbon"
                    />
                    <Image
                      src="/newui/publicnode.png"
                      width={300}
                      height={100}
                      alt="Public Node"
                    />
                  </div>
                </div>
              </div>
              {/* cta */}
              <div className="text-center p-12">
                <Link
                  href={featured}
                  className="bg-lime-600 text-white px-12 py-4 text-2xl rounded-full border shadow-xl border-none"
                >
                  Contribute Now
                </Link>
              </div>
            </div>

            {/* CHART */}
            <div className="container">
              <div className="flex flex-col max-w-[920px] rounded-lg bg-slate-400 bg-[#00000022] justify-center items-center mx-auto mt-16 p-12 shadow-xl">
                <h2 className="mb-12 text-white text-4xl font-bold">
                  {perc.toFixed(2)}% Carbon Neutral
                </h2>
                <CarbonChart goal={100} value={perc} />
                <p className="mt-4 text-white">
                  {tonx.toFixed(2)} out of {tons.toFixed(2)} tons of carbon offset as of {date}
                </p>
              </div>
            </div>

            {/* CREDITS */}
            {stories?.length > 0 && 
              <div className="flex flex-col mt-24 pb-24">
                <div className="text-center">
                  <h2 className="mt-6 mb-12 text-white text-4xl font-bold">
                    Recent Carbon Credit Retirements
                  </h2>
                  <div className="container grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    { stories.map(story => {
                        return <StoryCard key={story.id} story={story} />
                      })
                    }
                  </div>
                </div>
              </div>
            }
            {/*<div className="text-center">{appMode}</div>*/}
          </div>
        </div>
      </div>
    </>
  );
}
