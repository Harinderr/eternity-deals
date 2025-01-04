import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteProduct } from "@/server/actions/products"


const DeleteModel = ({id} : {id:string}) => {
  const {toast} = useToast()
   async function Deletetoast(id:string) {
     const response = await deleteProduct(id)
      toast({
        title : response.error ? 'Error' : 'Success',
        description : response.message,
        variant : response.error ? "destructive" : "default"
      })
    }
  return (
   

  <AlertDialogContent className="bg-white">
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-600/90" onClick={()=> Deletetoast(id) }>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>


  )
}

export default DeleteModel