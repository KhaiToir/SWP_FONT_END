import * as React from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  RecurrenceEditorComponent,
} from "@syncfusion/ej2-react-schedule";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  createSlot,
  deleteSlotById,
  getAllSlotByLecturerID,
  searchRequestById,
  searchTeacherById,
} from "../../api";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import {
  DateTimePickerComponent,
  DatePickerComponent,
  TimePickerComponent,
} from "@syncfusion/ej2-react-calendars";

import { L10n } from "@syncfusion/ej2-base";
import { LuLock } from "react-icons/lu";
L10n.load({
  "en-US": {
    schedule: {
      saveButton: "Add",
      cancelButton: "Close",
      newEvent: "New Slot",
      addTitle: "New Location",
    },
  },
});
export default function SchedulerLecturer({ userId, chosePage }) {
  const { requestId } = useParams();
  const [bookingRooms, setBookingRooms] = useState([]);
  const [showList, setShowList] = useState([]);
  const [requestInfor, setRequestInfor] = useState({});
  const [added, setAdded] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [repeat, setRepeat] = useState("Never");
  const scheduleObj = useRef(null);
  const recurrObject = useRef(null);
  async function fetchData() {
    const response = await getAllSlotByLecturerID(parseInt(userId))
      .then((data) =>
        setBookingRooms(data.filter((slot) => slot.status !== "Unactive"))
      )
      .catch((error) => console.log(error));
  }
  async function makePostRequest(form) {
    try {
      const response = await createSlot(form);
      return response;
    } catch (error) {}
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
        let BookedSucces = "";
        if (infor.bookingId.length <= 0) {
          BookedSucces = "Booked: " + 0 + "/" + infor.limitBooking;
        } else {
          BookedSucces =
            "Booked: " + infor.bookingId.length + "/" + infor.limitBooking;
        }
        if (infor.status === "Finish") {
          infor.ResourceID = 2;
          infor.IsReadonly = true;
        } else if (infor.status === "Not Book") {
          infor.ResourceID = 1;
        }
        infor.Description =
          BookedSucces + (infor.code && " - Code: " + infor.code);
        // Update the infor object with the response object in the subjectId property
        // Update the infor object with the response object in the slotId property
        return infor; // Return the updated infor object
      })
    );
    // Updated array
    console.log(updatedRequestedList);
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
    { Status: "Not Book", Id: 1, Color: "#6babfa" },
    { Status: "Finish", Id: 2, Color: "#000000" },

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
    description: { name: "Description" },
    startTime: { name: "StartTime" },
    endTime: { name: "EndTime" },
  };
  const eventTemplate = (props) => {
    return (
      <div>
        {props.code && (
          <div className="absolute right-0 text-black">
            <LuLock />
          </div>
        )}
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
  const onPopupOpen = (args) => {};
  const onPopupClose = (args) => {
    // if (args.type === "Editor" && args.data) {
    //   args.data.RecurrenceRule = recurrObject.current.value;
    // }
  };

  //validate function
  const isValidLocation = (location) => {
    const locationRegex = /^(NVHSV|CAMPUS) P\d{3}$/; // Regular expression for validation

    return locationRegex.test(location);
  };

  const onActionBegin = async (args) => {
    // {
    //   "lecturerId": 5,
    //   "location": "testDate",
    //   "code": "",
    //   "limitBooking": 7,
    //   "mode": "Publish",
    //   "date": "2023-11-18T01:00:00.000+07",
    //   "startDateTime": "2023-11-18T01:00:00.000+07",
    //   "endDateTime": "2023-11-18T02:30:00.000+07"
    // }

    // Check if the action is 'Add'
    if (args.requestType === "eventCreate") {
      const newEvent = args.data[0]; // The newly created event
      console.log("New Event Created:", newEvent);
      const today = new Date();

      //form Data
      const location = newEvent.Subject ? newEvent.Subject : newEvent.location;
      const startDate = new Date(newEvent.StartTime);
      const startDateTime = format(startDate, "yyyy-MM-dd'T'HH:mm", {
        timeZone: "UTC",
      });
      const endDate = new Date(newEvent.EndTime);
      const endDateTime = format(endDate, "yyyy-MM-dd'T'HH:mm", {
        timeZone: "UTC",
      });

      const date = format(endDate, "yyyy-MM-dd'T'00:00", {
        timeZone: "UTC",
      });

      //validate
      if (startDate < today) {
        // Cancel the event creation and show a message
        alert("Start time must be greater than or equal to today.");
        args.cancel = true;
        return;
      }
      const durationInMinutes = (endDate - startDate) / (1000 * 60); // Calculate duration in minutes
      if (
        startDate < today ||
        durationInMinutes < 15 ||
        durationInMinutes > 180
      ) {
        // Cancel the event creation and show a message
        args.cancel = true;
        alert(
          "Invalid duration. The event duration must be between 15 minutes and 3 hours."
        );
        return;
      }
      if (!isValidLocation(location)) {
        // Cancel the event creation and show a message
        args.cancel = true;
        alert(
          "Invalid location format. Location must be in the format 'NVHSV P000' or 'CAMPUS P000'."
        );
        return;
      }
      if (parseInt(newEvent.limitBooking) <= 0) {
        args.cancel = true;
        alert(
          "Invalid limit booking numbers. Limit booking  must be larger than 0."
        );
        return;
      }

      const formData = {
        lecturerId: parseInt(userId),
        code: newEvent.code ? newEvent.code : "",
        limitBooking: newEvent.limitBooking
          ? parseInt(newEvent.limitBooking)
          : "20",
        mode: "Public",
        location,
        date,
        startDateTime,
        endDateTime,
        repeat: repeat,
      };

      console.log("hello formdata ne", formData);
      try {
        const result = await makePostRequest(formData);

        console.log(result);
        setRepeat("Never");
        alert(result);
      } catch (error) {
        console.error("Error making POST request:", error);
        return;
      }
      // Do something with the new event data
      scheduleObj.current.refreshEvents();
      setRefresh(true);
    } else if (args.requestType === "eventRemove") {
      // Check if the action is 'Delete'
      const deletedEvent = args.data[0]; // The deleted event
      console.log("Deleted Event:", deletedEvent);

      // Perform the delete operation here
      try {
        // Assuming you have a function to handle delete

        const result = await deleteSlotById(parseInt(deletedEvent.id)); // Implement this function
        console.log(result);
        alert(result);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(error);
        return;
      }

      // Do something after the delete operation if needed
      scheduleObj.current.refreshEvents();
      setRefresh(true);
    }
  };

  const editorWindownTemplete = (props) => {
    return props !== undefined ? (
      <table className="custom-event-editor justify-center flex">
        <tbody>
          <tr className="">
            <td className="pr-5 e-textlabel">Location </td>
            <td>
              <input
                id="location"
                name="location"
                className="e-field e-input"
                type="text"
                placeholder="*NNVHSV||CAMPUS P000"
              ></input>
            </td>
          </tr>
          <tr className="">
            <td className="pr-5 e-textlabel">From</td>
            <td>
              <DateTimePickerComponent
                id="StartTime"
                date-name="StartTime"
                format="dd/MM/yy hh:mm a"
                className="e-field"
                value={
                  props.StartTime &&
                  new Date(props.StartTime || props.startTime)
                }
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr className="">
            <td className="pr-5 e-textlabel">To</td>
            <td>
              <DateTimePickerComponent
                id="EndTime"
                date-name="EndTime"
                format="dd/MM/yy hh:mm a"
                className="e-field"
                value={
                  props.StartTime && new Date(props.EndTime || props.endTime)
                }
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr className="">
            <td className="pr-5 e-textlabel">Limit</td>
            <td>
              <input
                id="limitBooking"
                name="limitBooking"
                className="e-field e-input"
                type="number"
                value={props.limitBooking && props.limitBooking}
              ></input>
            </td>
          </tr>
          <tr className="">
            <td className="pr-5 e-textlabel">Code</td>
            <td>
              <input
                id="code"
                name="code"
                className="e-field e-input"
                type="text"
              ></input>
            </td>
          </tr>
          <tr className="">
            <td className="pr-5 e-textlabel">Repeat</td>
            <td>
              <DropDownListComponent
                id="repeat"
                name="repeat"
                dataSource={["Never", "Daily", "Weekly"]}
                value={repeat && repeat}
                onChange={(e) => setRepeat(e.target.value)}
              ></DropDownListComponent>
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      ""
    );
  };

  return (
    <ScheduleComponent
      ref={scheduleObj}
      eventSettings={{
        dataSource: showList,
        fields: fieldsData,
        template: eventTemplate,
      }}
      popupOpen={onPopupOpen.bind(this)}
      actionBegin={onActionBegin.bind(this)}
      editorTemplate={editorWindownTemplete}
      popupClose={onPopupClose}
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
