interface Props {
  heading: string
}

function Heading({heading}: Props) {
  return (
    <div className="flex h-28 flex-wrap items-center justify-center bg-[#00a4e3] font-sans text-5xl font-bold text-white">
      {heading.toUpperCase()}
    </div>
  )
}

export default Heading
