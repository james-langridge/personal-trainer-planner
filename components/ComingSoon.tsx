export function ComingSoon() {
  return (
    <section className="min-h-full w-full bg-white dark:bg-gray-900">
      <div className="container relative mx-auto flex min-h-[250px] flex-col px-6 py-8 sm:min-h-[500px]">
        <section className="flex flex-1 items-center">
          <div className="flex w-full flex-col ">
            <h1 className="text-center text-5xl font-extrabold lg:text-7xl 2xl:text-8xl">
              <span className="bg-gradient-to-br from-teal-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
                Coming
              </span>
              <span className="bg-gradient-to-tr from-blue-500 via-pink-500 to-red-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-pink-300 dark:to-red-500">
                Soon
              </span>
            </h1>
          </div>
        </section>
      </div>
    </section>
  )
}
