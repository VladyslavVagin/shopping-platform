"use client"

import { Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from "sonner"
import type { CartItem } from '@/types'
import { addItemToCart } from '@/lib/actions/cart.action'

type Props = {
  item: CartItem
}

const AddToCart = ({ item }: Props) => {
  const router = useRouter()

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if(!res.success) {
        toast.error(res.message)
        return;
    }
    toast.success(`${item.name} added to cart`, {
      action: {
        label: "Go to Cart",
        onClick: () => router.push("/cart")
      }
    })
  }

  return (
    <Button type='button' className='w-full' onClick={handleAddToCart}><Plus /> Add to Cart</Button>
  )
}

export default AddToCart