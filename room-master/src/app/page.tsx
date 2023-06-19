import HeroBoxes from '@/components/HeroBoxes';

export default async function Home() {

  // const res = await fetch(`${process.env.VERCEL_URL}/api/stats?search=reservations`, {next: { revalidate: 300}});
  // const data: {count: number} = await res.json() || 0; 
  const data = {count: 0}
  return (
    <>
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold pb-4 xl:pb-20">Finally, a way to be the <strong className="text-accent">master</strong> of the library</h1>
        <h2 className='text-primary text-2xl lg:text-3xl xl:text-4xl font-bold pb-4'>Gone are the days of scrambling to find a library room. </h2>
      <div className='flex flex-wrap justify-center lg:justify-between '>
        <div className='text-justify'>
          <p className="lg:w-[43vw] text-lg font-medium pb-4">
            Room Master is an incredibly efficient tool that takes away the hassle of manually reserving rooms in the Concordia Webster Library. 
            By inputting your preferred reservation schedule, Room Master handles all the reservation tasks seamlessly, ensuring that you have a room 
            available at your desired times. This automated bot streamlines the process, saving you valuable time and energy. 
          </p>
          <p className='lg:w-[43vw] text-lg font-medium pb-4'>
            With Room Master&apos;s assistance, you can focus on your studies or research, knowing that your room reservations are being managed effortlessly. 
            Experience the convenience and reliability of Room Master as it simplifies your library room booking experience like never before.
          </p>
        </div>
        <div>
        <div className="stats shadow mb-4 w-full">
          <div className="stat">
            <div className="stat-title">Total Reservations</div>
            <div className="stat-value">{data.count.toLocaleString("en-US")}</div>
          </div>
        </div>
          <HeroBoxes/>
        </div>
      </div>
    </>
  );
}
