import axios from "axios";

export const baseURL =
    "https://meetmylecturer1.azurewebsites.net/api";

export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerfication`, {
            headers: {
                Authorization: "Bearer " + token
            },
        });
        return res.data.data;
    } catch (err) {
        return null;
    }
};
//get
export const getAllUser = async () => {
    try {
        const res = await axios.get(`${baseURL}/Account`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const getLogin = async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Account/Login`,form);
        return res.data.data;
    } catch (err) {
        return err.response.data;
    }
};
export const getAllBookingByLecturerIDORStudentID = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Booking/GetAllById/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const getAllSlotByLecturerID = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Slot/GetAllById/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
export const getAllRequestByLecturerORStudentID = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Request/GetAllById//${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
export const getAllFeedBackByLecturer = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Feedback/GetAllById//${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
export const getAllSubject = async () => {
    try {
        const res = await axios.get(`${baseURL}/Subject`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
export const getAllNotification = async () => {
    try {
        const res = await axios.get(`${baseURL}/Notification`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
//search
export const searchTeacherById = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Account/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const searchStudentById = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Account/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const searchSubjectById = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Subject/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
export const searchSlotById = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Slot/${id}`);
        return res.data.data;
    } catch (err) {
        console.error('Error in searchSlotById:', err);
        return {};
    }
};
export const searchBookingById = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Booking/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
export const searchRequestById = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/Request/${id}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};
//create
export const createAccount= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Account`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Account create successfully.');
            return('Account create successfully.')
        } else {
            console.log(`Received status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error create account:', err);
        return (err.response.data);
    }
}
export const createCourse= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Subject`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Subject create successfully.');
        } else {
            console.log(`Subject status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error create course:', err);
    }
}
export const createBookingByCode= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Booking/CreateByCode`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Slot create successfully.');
            return ("Booked succesfully!!!")
        } else {
    
            return ("Wrong code or slot!!!");
        }
    } catch (err) {
        // Log the detailed error message
        return (err.response.data);
    }
}
export const createBooking= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Booking`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Slot create successfully.');
            return ("Booked succesfully!!!")
        } else {
            return ("Wrong code or slot!!!");
        }
    } catch (err) {
        // Log the detailed error message
        return (err.response.data);
    }
}
export const createSlot= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Slot`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
          return('Slot create successfully.');
        } else {
            console.log(`Slot status ${res.status} from the server.`);
  
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error create request:', err);
        return (err.response.data);
    }
}
export const createRequest= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Request`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Request create successfully.');
        } else {
            console.log(`Request status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error create request:', err);
    }
}
export const createFeedback= async (form) => {
    try {
        const res = await axios.post(`${baseURL}/Feedback`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
          return('Feedback create successfully.');
        } else {
            console.log(`Feedback status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        return (err.response.data);
    }
}


//delete
export const deleteAccountById = async (id) => {
    try {
        const res = await axios.delete(`${baseURL}/Account/${id}`);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Account deleted successfully.');
        } else {
            console.log(`Received status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error deleting account:', err);
    }
}
export const deleteSubjectById = async (id) => {
    try {
        const res = await axios.delete(`${baseURL}/Subject/${id}`);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('subject deleted successfully.');
        } else {
            console.log(`Received status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error deleting subject:', err);
    }
}
export const deleteSlotById = async (id) => {
    try {
        const res = await axios.delete(`${baseURL}/Slot/${id}`);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('subject deleted successfully.');
            return('subject deleted successfully.');
        } else {
            console.log(`Received status ${res.status} from the server.`);
            return (`Received status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error deleting subject:', err);
        return (err.response.data);
    }
}
export const deleteRequestById = async (id) => {
    try {
        const res = await axios.delete(`${baseURL}/Request/${id}`);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('subject deleted successfully.');
        } else {
            console.log(`Received status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error deleting subject:', err);
    }
}
export const deleteBookingtById = async (id) => {
    try {
        const res = await axios.delete(`${baseURL}/Booking/${id}`);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Booking deleted successfully.');
        } else {
            console.log(`Received status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error deleting booking:', err);
    }
}

//update
export const updateAccountById= async (form,id) => {
    try {
        const res = await axios.put(`${baseURL}/Account/${id}`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Account update successfully.');
        } else {
            console.log(`Account status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error update course:', err);
    }
}
export const updateCourseById= async (form,id) => {
    try {
        const res = await axios.put(`${baseURL}/Subject/${id}`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Subject update successfully.');
        } else {
            console.log(`Subject status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error update Subject:', err);
    }
}
export const updateBookingById= async (form,id) => {
    try {
        const res = await axios.put(`${baseURL}/Booking/${id}`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Slot update successfully.');
        } else {
            console.log(`Slot status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error update slot:', err);
    }
}
export const updateSlotById= async (form,id) => {
    try {
        const res = await axios.put(`${baseURL}/Slot/${id}`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
           return('Slot update successfully.');
        } else {
            console.log(`Slot status ${res.status} from the server.`);

        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error update slot:', err);
        return(err.response.data)
    }
}
export const updateRequestById= async (form,id) => {
    try {
        const res = await axios.put(`${baseURL}/Request/${id}`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Request update successfully.');
        } else {
            console.log(`Request status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error update request:', err);
    }
}
export const updateNotificationById= async (form,id) => {
    try {
        const res = await axios.put(`${baseURL}/Notification/${id}`,form);
        // Check if the response status is 200 OK
        if (res.status === 200) {
            console.log('Notification update successfully.');
        } else {
            console.log(`Notification status ${res.status} from the server.`);
        }
    } catch (err) {
        // Log the detailed error message
        console.error('Error update Notification:', err);
    }
}