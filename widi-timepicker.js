// Global variables
let widiTPCurrentHour = 0;
let widiTPCurrentMinute = 0;
let widiTPCurrentTarget = null;
let widiTPOnTimeSelected = null;

// Initialize TimePicker
function widiTPInitWidiTimePicker() {
    // Close options when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.widi-timepicker-options, .widi-timepicker-value').length) {
            widiTPHideOptions();
        }
    });

    // Close modal when clicking overlay
    $('#widiTimePickerOverlay').on('click', function(e) {
        if (e.target === this) {
            widiTPCancelTimePicker();
        }
    });
}

// Open TimePicker
function widiTPOpenWidiTimePicker(initialTime = '00:00', callback = null) {
    widiTPOnTimeSelected = callback;
    
    // Parse initial time
    const [hour, minute] = initialTime.split(':').map(Number);
    widiTPCurrentHour = hour || 0;
    widiTPCurrentMinute = minute || 0;
    
    widiTPUpdateDisplay();
    $('#widiTimePickerOverlay').fadeIn(200);
}

// Close TimePicker
function widiTPCloseWidiTimePicker() {
    $('#widiTimePickerOverlay').fadeOut(200);
    widiTPHideOptions();
}

// Update time display
function widiTPUpdateDisplay() {
    $('#widiHourValue').text(String(widiTPCurrentHour).padStart(2, '0'));
    $('#widiMinuteValue').text(String(widiTPCurrentMinute).padStart(2, '0'));
}

// Adjust time with arrows
function widiTPAdjustTime(type, delta) {
    if (type === 'hour') {
        widiTPCurrentHour = (widiTPCurrentHour + delta + 24) % 24;
    } else if (type === 'minute') {
        // const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        // let currentIndex = minutes.indexOf(widiTPCurrentMinute);
        // if (currentIndex === -1) {
        //     currentIndex = 0;
        // }
        // currentIndex = (currentIndex + delta + minutes.length) % minutes.length;
        // widiTPCurrentMinute = minutes[currentIndex];

        // update baru
        widiTPCurrentMinute = widiTPCurrentMinute + delta;
        if (widiTPCurrentMinute < 0) {
            widiTPCurrentMinute = 59; // wrap around to 55
        } else if (widiTPCurrentMinute >= 60) {
            widiTPCurrentMinute = 0; // reset to 0
        }
    }
    widiTPUpdateDisplay();
}

// Show options grid
function widiTPShowOptions(type) {
    const optionsGrid = $('#widiOptionsGrid');
    optionsGrid.empty();
    
    if (type === 'hour') {
        // Generate hours 00-23
        for (let i = 0; i < 24; i++) {
            const option = $('<div class="widi-timepicker-option">')
                .text(String(i).padStart(2, '0'))
                .on('click', function() {
                    widiTPCurrentHour = i;
                    widiTPUpdateDisplay();
                    widiTPHideOptions();
                });
            optionsGrid.append(option);
        }
    } else if (type === 'minute') {
        // Generate minutes in 5-minute intervals
        const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        minutes.forEach(minute => {
            const option = $('<div class="widi-timepicker-option">')
                .text(String(minute).padStart(2, '0'))
                .on('click', function() {
                    widiTPCurrentMinute = minute;
                    widiTPUpdateDisplay();
                    widiTPHideOptions();
                });
            optionsGrid.append(option);
        });
    }
    
    $('#widiTimePickerOptions').fadeIn(200);
}

// Hide options grid
function widiTPHideOptions() {
    $('#widiTimePickerOptions').fadeOut(200);
}

// Confirm selection
function widiTPConfirmTimePicker() {
    const selectedTime = String(widiTPCurrentHour).padStart(2, '0') + ':' + String(widiTPCurrentMinute).padStart(2, '0');
    
    if (widiTPOnTimeSelected && typeof widiTPOnTimeSelected === 'function') {
        widiTPOnTimeSelected(selectedTime);
    }
    
    widiTPCloseWidiTimePicker();
}

// Cancel selection
function widiTPCancelTimePicker() {
    widiTPCloseWidiTimePicker();
}

// Demo functions
function widiTPOpenTimePicker(selector, callback = function () { }) {
    if (!$(selector).length) {
        console.error('Selector not found, element tidak ditemukan:', selector);
        return;
    }
    const currentValue = $(selector).val() || '00:00';
    console.log('Opening TimePicker for:', selector, 'with initial value:', currentValue);
    widiTPOpenWidiTimePicker(currentValue, function(selectedTime) {
        $(selector).val(selectedTime).change();
        // Call the callback function if provided
        if (typeof callback === 'function') {
            callback(selectedTime);
        }
    });
}

// Initialize when document is ready
$(document).ready(function() {
    widiTPInitWidiTimePicker();
});

// Public API
window.WidiTimePicker = {
    open: widiTPOpenWidiTimePicker,
    close: widiTPCloseWidiTimePicker
};