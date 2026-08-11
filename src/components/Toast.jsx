import React, {useEffect} from 'react'

export default function Toast({message, onClose, duration=2000}){
  useEffect(()=>{
    const id = setTimeout(()=> onClose && onClose(), duration)
    return ()=>clearTimeout(id)
  }, [])
  return (
    <div className="fixed right-6 top-6 z-50">
      <div className="px-4 py-2 rounded shadow-lg bg-[#04202a] border border-cyan-400/20 text-white">
        {message}
      </div>
    </div>
  )
}
