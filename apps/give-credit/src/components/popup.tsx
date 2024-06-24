interface PopupProps {
  headerText?: string
  bodyText?: string
  button1?: JSX.Element
  button2?: JSX.Element
}

//Popup component to display popup
const Popup = ({ headerText, bodyText, button1, button2 }: PopupProps) => (
  <>
    <div className="backdrop-blur-sm z-40 break-normal justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-5 outline-none">
      <div className="relative w-auto">
        {/*text content*/}
        <div className="border-7 bg-slate-700 rounded-lg shadow-lg relative flex flex-col outline-none focus:outline-none">
          {/*text header*/}
          <div className="flex items-start justify-between p-7 rounded-t">
            <h3 className="text-white text-lg leading-relaxed font-bold">
              {headerText}
            </h3>
          </div>
          {/*body text*/}
          <div className="relative">
            <p className="ml-7 -mt-4 text-slate-10 text-lg leading-relaxed mr-5">
              {bodyText}
            </p>
          </div>
          {/* child tags */}
          <div className="flex items-center justify-end p-2">
            <div>{button1}</div>
            <div>{button2}</div>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Popup
