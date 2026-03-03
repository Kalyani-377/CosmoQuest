import meteorshower from "../assets/meteorshower.jpg"
// import mars from "../assets/mars.jpg"
// import iss from "../assets/iss.jpg"
export const events = [
    {
        id: "1",
        title: "Perseid Meteor Shower",
        type: "meteors",
        date: "Aug 12, 2026",
        time: "12:00 AM – 4:00 AM",
        visibility: "High",
        location: "Worldwide",
        description: "One of the brightest meteor showers. Up to 100 meteors per hour.",
        image: meteorshower
    },
    {
        id: "2",
        title: "Mars Visible Tonight",
        type: "planets",
        date: "Aug 13, 2026",
        time: "8:00 PM – 5:00 AM",
        visibility: "High",
        location: "India",
        description: "Mars will be clearly visible to naked eye.",
        image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9"
    },
    {
        id: "3",
        title: "ISS Passing Over India",
        type: "iss",
        date: "Aug 14, 2026",
        time: "7:32 PM",
        visibility: "Medium",
        location: "India",
        description: "ISS visible for 6 minutes moving across sky.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
    }
];
