import { fetchRooms } from '@/api/room';
import CreateRoom from './components/createRoom';
import RoomsList from './components/allRooms';

const Page = async () => {

  const allRooms = await fetchRooms();
  return (
    <div>
          <RoomsList allRooms = {allRooms}/>
          <CreateRoom/>
    </div>
  )
}

export default Page