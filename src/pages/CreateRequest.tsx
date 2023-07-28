import Input from "@/components/Input";
import img1 from "@assets/Create_Request_images/3d printer.svg"
import img2 from "@assets/Create_Request_images/Laser.svg"
import img3 from "@assets/Create_Request_images/cnc.svg"
import img4 from "@assets/Create_Request_images/PCB.svg"
import img5 from "@assets/Create_Request_images/PCB Mi.svg"
import img6 from "@assets/Create_Request_images/embedded.svg"
import img7 from "@assets/Create_Request_images/Sensor.svg"
import img8 from "@assets/Create_Request_images/Mech.svg"
import img9 from "@assets/Create_Request_images/modelling.svg"
import BottomNavbar from "@/components/Navbar/BottomNavbar";
function Create ()
{
  return(
        <>
        <div className="grid grid-cols-1 lg:grid-cols-1 lg:w-96">
        <div className="flex flex-row justify-between">
        <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
</svg>
<h1 className="text-2xl">Request Items</h1>
<svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="30" height="28" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
</svg>

        </div>
<Input className={"m-4"}></Input>
<h1 class={"text-center text-xl"}>Choose Category</h1>
<div className={"grid grid-cols-3 justify-items-center mt-10 gap-16"}>
  <img src={img1}>  </img>
  <img src={img2}></img>
  <img src={img3}></img>
  <img src={img4}></img>
  <img src={img5}></img>
  <img src={img6}></img>
  <img src={img7}></img>
  <img src={img8}></img>
  <img src={img9}></img>

</div>
<div className={"grid grid-cols-3 justify-items-center -mt-56 gap-16"}>
  <p className={"mt-1 text-center"}>3D Printing & Scanning</p>
  <p className={"mt-0 text-center"}>Laser Cutting</p>
  <p className={"mt-1 text-center"}>CNC Milling</p>
  <p className={"mt-1 text-center"}>PCB Components</p>
  <p className={"mt-1 text-center"}>PCB Mining</p>
  <p className={"mt-1 text-center"}>Embedded Programming</p>
  <p>Sensor</p>
  <p>Mechanical Components</p>
  <p>Molding & Casting</p>

</div>
        <BottomNavbar></BottomNavbar>
       </div>
        </>
    )
}
export default Create;