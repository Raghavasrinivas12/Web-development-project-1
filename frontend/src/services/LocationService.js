const ACCURACY = { EXCELLENT: 50, GOOD: 100, MODERATE: 1000 };

export function evaluateAccuracy(accuracy) {
  if (accuracy <= ACCURACY.EXCELLENT)
    return { level: 'excellent', label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/40' };
  if (accuracy <= ACCURACY.GOOD)
    return { level: 'good', label: 'Good', color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/40' };
  if (accuracy <= ACCURACY.MODERATE)
    return { level: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' };
  return { level: 'poor', label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' };
}

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const err = new Error('Geolocation is not supported by your browser. Please enter your address manually.');
      err.code = 'NOT_SUPPORTED';
      reject(err);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy),
        timestamp: pos.timestamp,
      }),
      (err) => {
        const messages = {
          [err.PERMISSION_DENIED]: 'Location access was denied. Enable location permissions in your browser settings, or enter your address manually.',
          [err.TIMEOUT]: 'Location request timed out. Try a different device or enter your address manually.',
          [err.POSITION_UNAVAILABLE]: 'Location is unavailable. Try moving to an open area, enabling GPS, or using a smartphone.',
        };
        const error = new Error(messages[err.code] || 'An unknown error occurred while detecting your location.');
        error.code = err.code;
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, ...options }
    );
  });
}

export async function reverseGeocode(latitude, longitude) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Failed to fetch address details. Please enter your address manually.');
  const data = await res.json();
  const a = data.address || {};
  return {
    street: [a.house_number, a.road, a.commercial, a.suburb, a.neighbourhood].filter(Boolean).join(', '),
    city: a.city || a.town || a.village || a.municipality || a.city_district || a.county || a.suburb || '',
    state: a.state || a.state_district || a.region || '',
    zipCode: a.postcode || a.postal_code || '',
    country: a.country || 'India',
    displayName: data.display_name || '',
  };
}

export function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isSecureContext() {
  return window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}
