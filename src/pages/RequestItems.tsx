import SearchInput from "@components/SearchInput";
import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import BottomNavbar from "@/components/Navbar/BottomNavbar";

const RequestItems = () => {
  return (
    <div className="flex flex-col justify-center items-center  bg-neutral-50 p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>
      <SearchInput />
      <div className="xs:max-lg:grid xs:max-lg:grid-cols-1  " >
       
        
        {/* cards */}
        <div className=" mt-4 shadow-2xl">

        <div className="  overflow-scroll w-full scroll">
       
  
        <div className="grid grid-cols-1 justify-items-center gap-14">

            <div className="shadow-xl w-80 h-72 rounded-2xl">
            <h6 className="text-sm pl-4 text-slate-600">Approved at 21th  May 2023 12:18 PM</h6>

          
            <br />
            <div className="text-center grid grid-cols-3 gap-2 place-items-baseline align-baseline content-baseline">
              <h6 className="text-slate-500">Issue Requests <br />  3</h6>
              <h6 className="text-slate-500">unique Items <br />  6</h6>
              <h6 className="text-slate-500">Qty Requested <br />  32</h6>
              <h6 className="text-slate-500">Brrow Request <br />  33</h6>
              <h6 className="text-slate-500">Unique items <br />  13</h6>
              <h6 className="text-slate-500">Qty Requested <br />  7</h6>
           
            </div>
            <button className="p-2 ml-10 m-6 w-28 rounded-xl" style={{"background":"#1D747E"}}>view details</button>
              <button className="p-2 m-6  w-24  rounded-xl" style={{"background":"#1D747E"}}>Return</button>

            </div>
         
            <div className="shadow-xl w-80 h-72 rounded-2xl">
            <h6 className="text-sm pl-4">Approved at 21th  May 2023 12:18 PM</h6>
            <br />
            <div className="text-center grid grid-cols-3 gap-2 place-items-baseline align-baseline content-baseline">
              <h6 className="text-slate-500">Issue Requests <br /><p className="text-slate-800">3</p></h6>
              <h6 className="text-slate-500">unique Items <br />  6</h6>
              <h6 className="text-slate-500">Qty Requested <br />  32</h6>
              <h6 className="text-slate-500">Brrow Request <br />  33</h6>
              <h6 className="text-slate-500">Unique items <br />  13</h6>
              <h6 className="text-slate-500">Qty Requested <br />  7</h6>
           
            </div>
              <button className="p-2 ml-10 m-6 w-28 rounded-xl" style={{"background":"#1D747E"}}>view details</button>
              <button className="p-2 m-6  w-24  rounded-xl" style={{"background":"#1D747E"}}>Return</button>

            </div>
          
            <div className="shadow-xl w-80 h-72 rounded-2xl">
            <h6 className="text-sm pl-4">Approved at 21th  May 2023 12:18 PM</h6>
            <br />
            <div className="text-center grid grid-cols-3 gap-2 place-items-baseline align-baseline content-baseline">
              <h6 className="">Issue Requests <br />  3</h6>
              <h6 className="">unique Items <br />  6</h6>
              <h6 className="">Qty Requested <br />  32</h6>
              <h6 className="">Brrow Request <br />  33</h6>
              <h6 className="">Unique items <br />  13</h6>
              <h6 className="">Qty Requested <br />  7</h6>
           
            </div>
            <button className="p-2 ml-10 m-6 w-28 rounded-xl" style={{"background":"#1D747E"}}>view details</button>
              <button className="p-2 m-6  w-24  rounded-xl" style={{"background":"#1D747E"}}>Return</button>
            </div>
            <br />
            <br />
        </div>
      </div>
</div>
  <BottomNavbar></BottomNavbar>
        </div>
    </div>
  );
};

export default RequestItems;
