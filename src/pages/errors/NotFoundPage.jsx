import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B132B] p-4 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative">
          <h1 className="text-9xl font-bold text-white/5">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/10 p-8">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">404</div>
            </div>
          </div>
        </div>
        
        <h2 className="mt-8 text-2xl font-bold tracking-tight text-white">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 inline h-4 w-4" />
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage