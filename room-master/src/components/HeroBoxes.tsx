


export default function HeroBoxes() {
  return (
    <div className="grid grid-cols-4 grid-rows-5 grid-flow gap-6 xl:pr-[8vw] h-min">
      <div className="btn btn-disabled row-span-3 bg-black bg-opacity-10 w-12 lg:w-16 xl:w-20 h-auto"/>
      <div className="btn btn-disabled row-span-2 bg-accent bg-opacity-50 w-auto h-auto"/>
      <div className="btn btn-disabled col-span-2 bg-secondary h-12 lg:h-16 xl:h-20 w-auto"/>
      <div className="btn btn-disabled col-span-2 row-span-2 bg-primary h-auto w-auto"/>
      <div className="btn btn-disabled row-span-3 bg-secondary w-auto h-auto"/>
      <div className="btn btn-disabled bg-accent w-auto h-auto"/>
      <div className="btn btn-disabled col-span-2 bg-primary bg-opacity-40 w-auto h-12 lg:h-16 xl:h-20"/>
    </div>
  );
}
