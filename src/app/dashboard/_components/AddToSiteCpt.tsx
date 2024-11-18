import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { env } from "@/data/env/client"
import CopyToClip from "./CopyToClip"


const AddToSiteCpt = ({id} : {id : string}) => {
const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`
  return (

  <DialogContent className="bg-white max-w-max">
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <pre className="bg-gray-200">
        <code className="overflow-auto py-4">{code}</code>
    </pre>
    <CopyToClip CopyText={code} ></CopyToClip>
  </DialogContent>
  )
}

export default AddToSiteCpt