function ProgramAdBanner({entry, children}: any) {
  return (
    <>
      <h1>{entry.fields.heading}</h1>
      <div>{children}</div>
    </>
  )
}

export default ProgramAdBanner
