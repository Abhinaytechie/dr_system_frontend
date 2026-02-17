import React, { useState } from 'react';
import { Search, Map as MapIcon, Loader2, Hospital, Star, ExternalLink } from 'lucide-react';

interface Facility {
    id: string;
    name: string;
    address: string;
    type?: string;
    rating?: number;
    link?: string;
}

const EyeCareFacilities: React.FC = () => {
    const [searchMode, setSearchMode] = useState<'city' | 'address' | 'location'>('city');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchFacilities = async (params: { city?: string; lat?: number; lng?: number }) => {
        const cacheKey = `serp_hospitals_${JSON.stringify(params)}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            setFacilities(JSON.parse(cached));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let url = 'http://localhost:8000/hospitals?';
            if (params.lat && params.lng) {
                url += `lat=${params.lat}&lng=${params.lng}`;
            } else if (params.city) {
                url += `city=${encodeURIComponent(params.city)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to connect to search service');
            const data = await response.json();

            if (data && data.length > 0) {
                setFacilities(data);
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
            } else {
                setFacilities([]);
                setError(`No specialized eye hospitals found. Please try a different search.`);
            }
        } catch (err) {
            console.error('Facility search error:', err);
            setError('The search service is currently unavailable. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchFacilities({ lat: latitude, lng: longitude });
            },
            () => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        await fetchFacilities({ city: query.trim() });
    };

    return (
        <section id="eye-care-facilities" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nearby Eye Care Facilities</h2>
                    <p className="text-gray-600">Find specialized eye hospitals and retina centers for professional consultation.</p>
                </div>

                <div className="max-w-xl mx-auto mb-12">
                    <div className="flex justify-center gap-4 mb-8">
                        {[
                            { id: 'city', label: 'By City', icon: Hospital },
                            { id: 'address', label: 'Specific Area', icon: Search },
                            { id: 'location', label: 'Near Me', icon: MapIcon },
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => {
                                    setSearchMode(mode.id as any);
                                    if (mode.id === 'location') handleGetCurrentLocation();
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${searchMode === mode.id
                                    ? 'bg-medical-accent text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <mode.icon className="w-4 h-4" />
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    {searchMode !== 'location' && (
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={searchMode === 'city' ? "Enter your city (e.g. Chennai)" : "Enter specific area or landmark"}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-medical-accent/20 focus:border-medical-accent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-medical-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-medical-accent/90 shadow-md transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                            </button>
                        </form>
                    )}

                    {searchMode === 'location' && !facilities.length && !loading && (
                        <div className="text-center py-4">
                            <button
                                onClick={handleGetCurrentLocation}
                                className="inline-flex items-center gap-2 bg-white border-2 border-medical-accent text-medical-accent px-6 py-3 rounded-xl font-bold hover:bg-medical-accent hover:text-white transition-all shadow-sm"
                            >
                                <MapIcon className="w-5 h-5" />
                                Get My Current Location
                            </button>
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="w-8 h-8 text-medical-accent animate-spin mb-4" />
                        <p className="text-gray-500 font-medium mb-1">Searching live web results...</p>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                            We are retrieving the most accurate hospital data for your area from live search results.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center mb-10">
                        {error}
                    </div>
                )}

                {!loading && facilities.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {facilities.map((facility, index) => (
                            <div key={index} className="p-5 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all flex flex-col h-full">
                                <div className="mb-3">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-start gap-2">
                                            <Hospital className="w-4 h-4 text-medical-accent mt-1 shrink-0" />
                                            <h3 className="font-bold text-gray-900 leading-tight">{facility.name}</h3>
                                        </div>
                                        {facility.rating && (
                                            <div className="flex items-center gap-1 bg-yellow-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-700">
                                                <Star className="w-2.5 h-2.5 fill-yellow-700" />
                                                {facility.rating}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-medical-accent/60 uppercase tracking-wider">
                                        {facility.type || 'Specialized Eye Care'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-2">{facility.address}</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-medical-accent hover:text-medical-accent/80 transition-colors"
                                    >
                                        <MapIcon className="w-3 h-3" />
                                        Directions
                                    </a>
                                    {facility.link && (
                                        <a
                                            href={facility.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Search className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Live Information Transparency</h4>
                            <p className="text-sm text-blue-800/80 leading-relaxed">
                                We use live web search results to provide you with the most up-to-date information.
                                This ensures you find active medical facilities and prevents you from potentially visiting closed or outdated clinics.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 italic">
                        * Information obtained via live web search. Please verify appointments directly with the hospital.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default EyeCareFacilities;
