// location-number.js - Enhanced version
const locationNumbers = {
    'nottingham': '0115 123 4567',
    'derby': '01332 123 456',
    'mansfield': '01623 123 456',
    'leicester': '0116 123 4567'
};

const locationCities = {
    'nottingham': 'Nottingham',
    'derby': 'Derby',
    'mansfield': 'Mansfield',
    'leicester': 'Leicester'
};

const defaultNumber = '01157722796';
const defaultCity = 'National Helpline';

async function detectLocation() {
    try {
        // Try multiple geolocation services for reliability
        const services = [
            'https://ipapi.co/json/',
            'https://ipinfo.io/json?token=test', // Replace with your token if needed
            'https://geolocation-db.com/json/'
        ];
        
        let locationData = null;
        
        // Try each service until one works
        for (const service of services) {
            try {
                const response = await fetch(service, { timeout: 3000 });
                if (response.ok) {
                    locationData = await response.json();
                    break;
                }
            } catch (e) {
                console.log(`Service ${service} failed, trying next...`);
                continue;
            }
        }
        
        if (!locationData) {
            throw new Error('All location services failed');
        }
        
        // Extract city from different service responses
        let city = '';
        if (locationData.city) {
            city = locationData.city.toLowerCase();
        } else if (locationData.city_name) {
            city = locationData.city_name.toLowerCase();
        }
        
        console.log('Detected city:', city);
        
        // Check for exact city match
        if (city && locationNumbers[city]) {
            return {
                number: locationNumbers[city],
                city: locationCities[city],
                detected: true
            };
        }
        
        // Check for partial city name match
        const detectedCity = Object.keys(locationNumbers).find(key => 
            city.includes(key) || key.includes(city)
        );
        
        if (detectedCity) {
            return {
                number: locationNumbers[detectedCity],
                city: locationCities[detectedCity],
                detected: true
            };
        }
        
    } catch (error) {
        console.log('Location detection failed:', error);
    }
    
    // Fallback to default
    return {
        number: defaultNumber,
        city: defaultCity,
        detected: false
    };
}

function updateContactNumbers(locationInfo) {
    // Update all phone number elements
    const phoneElements = document.querySelectorAll('.dynamic-phone');
    phoneElements.forEach(element => {
        const cleanNumber = locationInfo.number.replace(/\s/g, '');
        element.textContent = locationInfo.number;
        
        // Update href only if it's an anchor tag
        if (element.tagName === 'A') {
            element.href = `tel:${cleanNumber}`;
        }
    });
    
    // Update location text
    const locationElements = document.querySelectorAll('.dynamic-location');
    locationElements.forEach(element => {
        element.textContent = locationInfo.detected ? 
            `Serving ${locationInfo.city}` : 
            locationInfo.city;
    });
    
    // Update city in badge
    const cityElements = document.querySelectorAll('.dynamic-city');
    cityElements.forEach(element => {
        element.textContent = locationInfo.city;
    });
    
    // Show location badge if detected
    const locationBadges = document.querySelectorAll('.location-badge');
    locationBadges.forEach(badge => {
        if (locationInfo.detected) {
            badge.style.display = 'inline-block';
            badge.textContent = `Serving ${locationInfo.city}`;
        } else {
            badge.style.display = 'none';
        }
    });
    
    // Optional: Add visual feedback for detection
    const displayElement = document.querySelector('.dynamic-contact-display');
    if (displayElement && locationInfo.detected) {
        displayElement.style.borderLeft = '4px solid #228B22';
        displayElement.style.animation = 'pulse 2s';
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(34, 139, 34, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(34, 139, 34, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 139, 34, 0); }
    }
    
    .dynamic-phone {
        transition: all 0.3s ease;
    }
    
    .dynamic-phone:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state
    const phoneElements = document.querySelectorAll('.dynamic-phone');
    phoneElements.forEach(el => {
        const original = el.textContent;
        el.dataset.original = original;
        el.textContent = 'Detecting...';
    });
    
    // Detect location
    const locationInfo = await detectLocation();
    
    // Update numbers
    updateContactNumbers(locationInfo);
    
    // Add location selector if needed (optional)
    addLocationSelectorIfNeeded();
});

// Optional: Manual location selector
function addLocationSelectorIfNeeded() {
    if (document.querySelector('.location-selector-added')) return;
    
    const selectorHtml = `
        <div class="location-selector-added" style="position: fixed; bottom: 80px; right: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); z-index: 1000; max-width: 250px; border: 1px solid #ddd;">
            <p style="margin-bottom: 10px; font-weight: 600; color: #333; font-size: 0.9em;">
                <i class="fas fa-map-marker-alt" style="color: #228B22; margin-right: 5px;"></i>
                Not your area?
            </p>
            <select id="city-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em; margin-bottom: 10px;">
                <option value="auto">Auto-detect location</option>
                <option value="nottingham">Nottingham</option>
                <option value="derby">Derby</option>
                <option value="mansfield">Mansfield</option>
                <option value="leicester">Leicester</option>
            </select>
            <button id="update-location" style="width: 100%; padding: 8px; background: #228B22; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
                Update Number
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', selectorHtml);
    
    document.getElementById('update-location').addEventListener('click', function() {
        const select = document.getElementById('city-select');
        const selectedCity = select.value;
        
        if (selectedCity === 'auto') {
            detectLocation().then(updateContactNumbers);
        } else {
            updateContactNumbers({
                number: locationNumbers[selectedCity],
                city: locationCities[selectedCity],
                detected: true
            });
        }
        
        // Show confirmation
        const button = this;
        const originalText = button.textContent;
        button.textContent = 'Updated!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#228B22';
        }, 2000);
    });
}
