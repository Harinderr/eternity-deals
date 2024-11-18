import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BackButton = () => {
  return (
    <Button asChild className="size-10 rounded-full">
            <Link href={'/dashboard'}> 
        <ChevronLeft className="font-bold" />
        </Link>
        </Button>
  )
}

export default BackButton