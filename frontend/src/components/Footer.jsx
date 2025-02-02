import { Copyright } from "lucide-react"

const Footer = () => {
  return (
    <div className="flex relative w-full bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md z-50 p-8 justify-center items-center mt-auto">
      <p className="flex  items-center  ">
          <Copyright className="mr-1 w-4 h-4" />
          2025 Learn Divide.
        </p>
    </div>
  )
}

export default Footer
