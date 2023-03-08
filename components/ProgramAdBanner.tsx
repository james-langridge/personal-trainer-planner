function ProgramAdBanner({entry, children}: any) {
  return (
    <div className="bg-[#90d6da] py-14">
      <h1 className="text-center text-white font-sans font-bold text-4xl">
        {entry.fields.heading}
      </h1>
      <div className="py-7 m-auto w-[94%] md:flex md:justify-evenly ">
        {children}
      </div>
    </div>
  )
}

export default ProgramAdBanner
