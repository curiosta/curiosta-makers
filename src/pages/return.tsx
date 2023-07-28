import ActivityCard from "@/components/ActivityCard";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import SearchInput from "@/components/SearchInput";
import Typography from "@/components/Typography";
SearchInput
function Return()
{
    return(
        <>
        <div className="flex flex-col justify-center items-center  bg-neutral-50 p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>
      <SearchInput />
      <div className={"mt-5"}></div>
      <div className="xs:max-lg:grid xs:max-lg:grid-cols-1" >
       
        
        {/* cards */}
        <div className="grid grid-cols-1 justify-items-center gap-10">

            <div className="shadow-lg bg-white h-56 rounded-xl" style={{"width":"21rem"}}>
            <h6 className="text-sm pl-4 text-slate-600">Approved at 21th  May 2023 12:18 PM</h6>

          <div className={"mt-5"}></div>
            <div className="text-center flex flex-wrap gap-2 justify-center ">
              <h6 className="text-slate-500">Issue Requests <div>3</div></h6>
              <h6 className="text-slate-500">unique Items  <div>6</div></h6>
              <h6 className="text-slate-500">Qty Requested <div>32</div></h6>
              <h6 className="text-slate-500">Brrow Request <div>33</div></h6>
              <h6 className="text-slate-500">Unique items  <div>13</div></h6>
              <h6 className="text-slate-500">Qty Requested <div>7</div></h6>
           
            </div>
            <button className="p-2 ml-10 m-6 w-28 rounded-xl text-white" style={{"background":"#1D747E"}}>view details</button>
              <button className="p-2 m-6  w-24  rounded-xl text-white" style={{"background":"#1D747E"}}>Return</button>

            </div>
         
            <div className="shadow-lg bg-white h-56 rounded-xl" style={{"width":"21rem"}}>
            <h6 className="text-sm pl-4 text-slate-600">Approved at 21th  May 2023 12:18 PM</h6>

          <div className={"mt-5"}></div>
            <div className="text-center flex flex-wrap gap-2 justify-center ">
              <h6 className="text-slate-500">Issue Requests <div>3</div></h6>
              <h6 className="text-slate-500">unique Items  <div>6</div></h6>
              <h6 className="text-slate-500">Qty Requested <div>32</div></h6>
              <h6 className="text-slate-500">Brrow Request <div>33</div></h6>
              <h6 className="text-slate-500">Unique items  <div>13</div></h6>
              <h6 className="text-slate-500">Qty Requested <div>7</div></h6>
           
            </div>
            <button className="p-2 ml-10 m-6 w-28 rounded-xl text-white" style={{"background":"#1D747E"}}>view details</button>
              <button className="p-2 m-6  w-24  rounded-xl text-white" style={{"background":"#1D747E"}}>Return</button>

            </div>
          
            <div className="shadow-lg bg-white h-56 rounded-xl" style={{"width":"21rem"}}>
            <h6 className="text-sm pl-4 text-slate-600">Approved at 21th  May 2023 12:18 PM</h6>

          <div className={"mt-5"}></div>
            <div className="text-center flex flex-wrap gap-2 justify-center ">
              <h6 className="text-slate-500">Issue Requests <div>3</div></h6>
              <h6 className="text-slate-500">unique Items  <div>6</div></h6>
              <h6 className="text-slate-500">Qty Requested <div>32</div></h6>
              <h6 className="text-slate-500">Brrow Request <div>33</div></h6>
              <h6 className="text-slate-500">Unique items  <div>13</div></h6>
              <h6 className="text-slate-500">Qty Requested <div>7</div></h6>
           
            </div>
            <button className="p-2 ml-10 m-6 w-28 rounded-xl text-white" style={{"background":"#1D747E"}}>view details</button>
              <button className="p-2 m-6  w-24  rounded-xl text-white" style={{"background":"#1D747E"}}>Return</button>

            </div>
          
        </div>
      </div>
  <BottomNavbar></BottomNavbar>
        </div>
   
    </>
    )

}
export default Return;