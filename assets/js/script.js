var lift_data = [
    { lift_id: 1, working: false, lift_location: 0 },
    { lift_id: 2, working: false, lift_location: 0 },
    { lift_id: 3, working: false, lift_location: 0 },
    { lift_id: 4, working: false, lift_location: 0 },
    { lift_id: 5, working: false, lift_location: 0 }]

var calling_stack = {}

var pending_req = []

function onClick(button_element) {
    var button_id = button_element.id;
    var call_from_floor = parseInt(button_id.split('-')[1]);

    if (check_lift_here(call_from_floor)) {
        return
    }

    button_element.innerHTML = 'Waiting';
    button_element.style.backgroundColor = "red";

    if (!lift_available()) {
        pending_req.push(call_from_floor)
        return
    }
    else {
        assign_req(call_from_floor)
    }
}

function fatch_nearest_lift(floor_no) {

    var travelling_distance = 9;
    var nearest_lift_id = 1;
    var nearest_lift_location = lift_data.find(lift => lift.lift_id === nearest_lift_id).lift_location;
    for (const data of lift_data) {
        if (Math.abs(data.lift_location - floor_no) < travelling_distance && data.working == false) {

            travelling_distance = Math.abs(data.lift_location - floor_no);
            nearest_lift_id = data.lift_id;
            nearest_lift_location = data.lift_location;
        }
    }
    return { nearest_lift_id, nearest_lift_location };
}

function assign_req(call_from_floor) {
    var button_element = document.getElementById(`button-${call_from_floor}`);

    const { nearest_lift_id, nearest_lift_location } = fatch_nearest_lift(call_from_floor);

    var liftToUpdate = lift_data.find(lift => lift.lift_id === nearest_lift_id);
    liftToUpdate.lift_location = call_from_floor;
    liftToUpdate.working = true;

    const duration = Math.abs(0.5 * (call_from_floor - nearest_lift_location));

    const place_element = document.getElementById(`place-${call_from_floor}-${nearest_lift_id}`);
    if (call_from_floor) {
        place_element.innerHTML = `${duration} Sec`
    }

    var lift_element = document.getElementById(`lift-${nearest_lift_id}`);

    const pathElement = lift_element.querySelector('path');
    setTimeout(() => changeButton(call_from_floor, button_element, liftToUpdate, place_element, pathElement), duration * 1000);

    pathElement.setAttribute('fill', '#ff0000')
    lift_element.style.transition = `transform ${duration}s linear`;
    lift_element.style.transform = `translateY(-${call_from_floor * 120}%)`;
}
const playSound = () => {
    const sound = new Audio("./assets/music/music.mp3");
    sound.play();
};

function changeButton(call_from_floor, button_element, liftToUpdate, place_element, pathElement) {
    button_element.innerHTML = 'Arrived';
    button_element.style.backgroundColor = "white";
    if (call_from_floor !== 0) {
        place_element.innerHTML = ''
    }
    playSound()
    pathElement.setAttribute('fill', '#48BB78')

    setTimeout(() => changefinalButton(button_element, liftToUpdate, pathElement), 1000);
}

function lift_available() {
    is_lift = !!lift_data.filter(data => data.working === false).length
    return is_lift
}
function changefinalButton(button_element, liftToUpdate, pathElement) {
    button_element.innerHTML = 'call';
    button_element.style.backgroundColor = "#48BB78";
    liftToUpdate.working = false;
    pathElement.setAttribute('fill', '#000000')
    if (pending_req.length === 0) {
        return
    }
    else {
        assign_req(pending_req[0])
        pending_req.reverse()
        pending_req.pop()
        pending_req.reverse()
    }
}

function check_lift_here(floor_no) {
    const lift_here = lift_data.filter((data) => data.lift_location === floor_no);
    if (lift_here.length != 0) {
        return true
    }
    else {
        return false
    }
}
