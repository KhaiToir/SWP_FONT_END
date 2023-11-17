import * as React from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ResourcesDirective,
  ResourceDirective,
} from "@syncfusion/ej2-react-schedule";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  getAllSlotByLecturerID,
  searchRequestById,
  searchTeacherById,
} from "../../api";
import { useParams } from "react-router-dom";
import { useRef } from "react";

export default function SchedulerLecturer({ userId, chosePage }) {
  const { requestId } = useParams();
  const [bookingRooms, setBookingRooms] = useState([]);
  const [showList, setShowList] = useState([]);
  const [requestInfor, setRequestInfor] = useState({});

  const [refresh, setRefresh] = useState(false);
  const scheduleObj = useRef(null);
  async function fetchData() {
    const response = await getAllSlotByLecturerID(parseInt(userId))
      .then((data) => setBookingRooms(data))
      .catch((error) => console.log(error));
  }
  async function addObject() {
    const updatedRequestedList = await Promise.all(
      bookingRooms.map(async (infor) => {
        const lecturerInfor = await searchTeacherById(infor.lecturerId);
        // Update the infor object with the response object in the studentId property
        infor.StartTime = new Date(infor.startDatetime);
        infor.EndTime = new Date(infor.endDatetime);
        infor.Subject = lecturerInfor.fullname;
        infor.Status = infor.status;
        if (infor.bookingId.length <= 0) {
          infor.BookedSucces = 0+'/'+infor.limitBooking;
        } else {
          infor.BookedSucces = infor.bookingId.length+'/'+infor.limitBooking;
        }
        if (infor.status === "Finish") {
          infor.ResourceID = 1;
          infor.IsReadonly = true;
        } else if (infor.status === "Not Book") {
          infor.ResourceID = 2;
        } else if (infor.status === "Unactive") {
          infor.ResourceID = 3;
        }
        // Update the infor object with the response object in the subjectId property
        // Update the infor object with the response object in the slotId property
        return infor; // Return the updated infor object
      })
    );
    // Updated array
    setShowList(updatedRequestedList);
  }

  async function searchRequest(id) {
    const response = await searchRequestById(parseInt(id))
      .then((data) => setRequestInfor(data))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    chosePage("Scheduler");
    if (userId || refresh === true) fetchData();
    console.log("booking room");
    console.log(bookingRooms);
    setRefresh(false);
  }, [userId, refresh]);

  useEffect(() => {
    if (bookingRooms.length > 0) {
      addObject();
      requestId && searchRequest(requestId);
    }
    console.log(showList);
  }, [bookingRooms]);

  const resourceDataSource = [
    { Status: "Finish", Id: 1, Color: "#000000" },
    { Status: "Not Book", Id: 2, Color: "#6babfa" },
    { Status: "Unactive", Id: 3, Color: "#ff704d" },

    // { Status: 'Status1',
    // Id: 3,
    // Color: 'Color1'},
    // { Status: 'Status1',
    // Id: 4,
    // Color: 'Color1'},
  ];
  const fieldsData = {
    id: "id",
    subject: { name: "Subject" },
    location: { name: "location" },
    description: { name: "BookedSucces" },
    startTime: { name: "StartTime" },
    endTime: { name: "EndTime" },
  };
  const eventTemplate = (props) => {
    return (
      <div>
        <div className="subject font-bold">{props.Subject}</div>
        <div className="time font-medium">
          {props.location} {"("}
          {`${format(props.StartTime, "HH:mm")} - ${format(
            props.EndTime,
            "HH:mm"
          )}`}
          {")"}
        </div>
        <div className="status">{props.status}</div>
        {/* Add other fields as needed */}
      </div>
    );
  };
  const onPopupOpen = (args) => {
    if (args.type == 'Editor') {
        scheduleObj.current.eventWindow.recurrenceEditor.frequencies = ['none', 'daily', 'weekly'];
    }
}
  return (
    <ScheduleComponent
    ref={scheduleObj}
      eventSettings={{
        dataSource: showList,
        fields: fieldsData,
        template: eventTemplate,
      }}
      popupOpen={onPopupOpen.bind(this)}
    >
      <ResourcesDirective>
        <ResourceDirective
          field="ResourceID"
          title="Choose Status"
          name="Projects"
          textField="Status"
          idField="Id"
          colorField="Color"
          dataSource={resourceDataSource}
        ></ResourceDirective>
      </ResourcesDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
  );
}
