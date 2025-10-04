'use client'

export function NextMonthBtn({onClick}: {onClick?: () => void}) {
  return (
    <button
      onClick={onClick}
      className="mx-1 flex transform items-center justify-center rounded-md bg-white px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-gray-200 rtl:-scale-x-100"
      data-testid={'nextMonthBtn'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
