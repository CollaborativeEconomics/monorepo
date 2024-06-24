export default function Progress(props){
  const value = props.value || 0
  const style = `rounded text-white text-center bg-blue-700`
  const width = {width:value+'%'}
  //console.log(value)
  //console.log(style)
  return (
    <div className="max-w-[500px] w-full mx-auto bg-gray-200 dark:bg-slate-500 rounded-full px-2">
      <div className={style} style={width}>{value}%</div>
    </div>
  )
}