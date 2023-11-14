

const PostDetailGrid = (props) => {
  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-12 grid-rows-6 gap-4 h-[100vh] p-4 ">
        {props.children}
    </div>
  )
}

export default PostDetailGrid