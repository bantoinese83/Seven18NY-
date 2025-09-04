import React, { useState, useMemo, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { generateBookingQuote, generateEventInspiration } from '../services/geminiService';
import { sendBookingInquiry } from '../services/emailService';
import { BookingFormData, BookingQuote, VenuePackage, EventInspiration } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '../hooks/useToast';

// --- Helper Components & Data ---

const VENUE_PACKAGES: VenuePackage[] = [
  { id: 'social', name: 'The Social', price: '$75 / guest', description: 'Perfect for birthdays and casual get-togethers.', features: ['4-Hour Rental', 'House Sound System', 'Basic Furniture Setup', 'Staffing (1 Bartender)']},
  { id: 'gala', name: 'The Gala', price: '$3500 Flat Fee', description: 'An all-inclusive package for major celebrations.', features: ['6-Hour Rental', 'Premium Sound & Lighting', 'Full Furniture Setup', 'Staffing (2 Bartenders, 1 Support)', 'Welcome Drinks for Guests']},
  { id: 'corporate', name: 'The Corporate', price: '$120 / guest', description: 'Tailored for professional mixers and company events.', features: ['4-Hour Rental', 'A/V Package (Projector & Mic)', 'Catering Coordination', 'Staffing (1 Bartender, 1 Support)', 'Coffee & Water Station']},
];

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
  <div className="w-full mb-8">
    <div className="flex justify-between items-center text-sm font-semibold text-gray-400">
        <span className={step >= 1 ? 'text-brand-gold' : ''}>1. Date & Time</span>
        <span className={step >= 2 ? 'text-brand-gold' : ''}>2. Event Details</span>
        <span className={step >= 3 ? 'text-brand-gold' : ''}>3. Your Info</span>
        <span className={step >= 4 ? 'text-brand-gold' : ''}>4. Confirmation</span>
    </div>
    <div className="mt-2 h-2 w-full bg-gray-700 rounded-full">
        <div className="h-full bg-brand-gold rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
    </div>
  </div>
);

const QuoteSkeleton: React.FC = () => (
    <div className="text-center">
        <LoadingSpinner size="lg" color="gold" text="Generating your personalized quote..." />
        <div className="mt-8 animate-pulse">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-6 border-b border-gray-700 pb-3"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-5 bg-gray-700 rounded"></div>
                    <div className="h-5 bg-gray-700 rounded ml-auto w-1/4"></div>
                    <div className="h-5 bg-gray-700 rounded"></div>
                    <div className="h-5 bg-gray-700 rounded ml-auto w-1/4"></div>
                    <div className="h-5 bg-gray-600 rounded mt-3 pt-3 col-span-1 border-t border-gray-700"></div>
                    <div className="h-5 bg-gray-600 rounded mt-3 pt-3 ml-auto w-1/3 col-span-1 border-t border-gray-700"></div>
                </div>
            </div>
        </div>
    </div>
);


// --- Main Booking Component ---
const Booking: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: null, timeSlot: '', eventType: 'Birthday Party', guests: 25,
    selectedPackage: VENUE_PACKAGES[0], name: '', email: '', phone: '', details: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<BookingQuote | null>(null);
  const { success, error } = useToast();

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const setFormDataField = <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    
    if (!formData.email.trim()) {
        newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
        newErrors.phone = 'Phone Number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = 'Please enter a valid phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.email, formData.phone]);

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    try {
      const result = await generateBookingQuote(formData);
      setQuoteData(result);
      success('Quote Generated!', 'Your personalized quote is ready.');
      handleNext();
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setErrors({ details: errorMessage });
      error('Quote Generation Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isStep1Valid = !!(formData.date && formData.timeSlot);
  const isStep2Valid = !!(formData.eventType && formData.guests > 0 && formData.selectedPackage);
  const isStep3Valid = !!(formData.name && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.phone && formData.phone.replace(/\D/g, '').length >= 10);

  return (
    <section id="booking" className="py-24 md:py-40 bg-black/0 overflow-hidden">
      <div ref={ref} className={`container mx-auto px-6 fade-in-section ${isVisible ? 'is-visible' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-gold tracking-wide mb-6">
              Book Your Event
            </h2>
            <p className="text-xl text-gray-300 mb-6">Private events, corporate mixers, and celebrations</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto"></div>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? <QuoteSkeleton /> : (
              <>
                <ProgressBar step={step} />
                <div className="mt-8">
                  {step === 1 && <Step1_DateTime formData={formData} setField={setFormDataField} onNext={handleNext} isValid={isStep1Valid} />}
                  {step === 2 && <Step2_Details formData={formData} setField={setFormDataField} onNext={handleNext} onPrev={handlePrev} isValid={isStep2Valid} />}
                  {step === 3 && <Step3_Info formData={formData} setField={setFormDataField} onSubmit={handleSubmit} onPrev={handlePrev} isValid={isStep3Valid} errors={errors} onValidate={validate}/>}
                  {step === 4 && quoteData && <Step4_Confirmation quoteData={quoteData} formData={formData} />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};




// --- Step Components ---

const Step1_DateTime: React.FC<{
  formData: BookingFormData;
  setField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
  onNext: () => void;
  isValid: boolean;
}> = ({ formData, setField, onNext, isValid }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState(() => [
    new Date(2024, 6, 25), new Date(2024, 7, 5), new Date(2024, 7, 6)
  ].map(d => d.setHours(0,0,0,0)));
  
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }, []);



  const handleSyncCalendar = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newBookedDates = [new Date(2024, 7, 15), new Date(2024, 7, 28)].map(d => d.setHours(0,0,0,0));
      setUnavailableDates(prev => [...new Set([...prev, ...newBookedDates])]);
      setIsSyncing(false);
    }, 1500);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots: BookingFormData['timeSlot'][] = ['Morning (9am-1pm)', 'Afternoon (2pm-6pm)', 'Evening (7pm-11pm)'];

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  return (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold text-white mb-6">Select a Date & Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">&larr;</button>
                    <span className="font-semibold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">&rarr;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {weekdays.map(day => <div key={day} className="font-bold text-gray-400 text-sm">{day}</div>)}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {days.map(day => {
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isPast = date < today;
                        const isUnavailable = unavailableDates.includes(date.getTime());
                        const isSelected = formData.date?.getTime() === date.getTime();
                        
                        let classes = "p-2 rounded-full cursor-pointer transition-colors duration-200 text-sm ";
                        if (isPast || isUnavailable) classes += "text-gray-600 line-through cursor-not-allowed";
                        else if (isSelected) classes += "bg-brand-gold text-black font-bold";
                        else classes += "hover:bg-gray-600";
                        
                        return <div key={day} onClick={() => !isPast && !isUnavailable && setField('date', date)} className={classes}>{day}</div>;
                    })}
                </div>

            </div>
            <div className="space-y-6">
                {timeSlots.map((slot, index) => (
                    <div
                        key={slot}
                        onClick={() => setField('timeSlot', slot)}
                        className={`group relative transition-all duration-500 ease-out cursor-pointer`}
                        style={{
                            transitionDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Subtle background line */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>

                        <div className={`relative flex items-center gap-x-6 py-4 border-b border-gray-800/50 group-hover:border-brand-gold/30 transition-colors duration-500`}>
                            <div className="flex-shrink-0">
                                {formData.timeSlot === slot ? (
                                    <div className="w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full group-hover:border-brand-gold/60 transition-colors duration-500"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-display font-semibold text-white mb-1 group-hover:text-brand-gold transition-colors duration-500">
                                    {slot}
                                </h4>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                                    Perfect for your event timing
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-8 text-right">
            <button onClick={onNext} disabled={!isValid} className="btn-aurora bg-brand-gold text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">
                Next
            </button>
        </div>
    </div>
  )
}

const InspirationCard: React.FC<{ inspiration: EventInspiration }> = ({ inspiration }) => (
  <div className="mt-6 p-6 bg-gray-900/50 border border-brand-green/30 rounded-lg animate-fade-in-up">
    <h5 className="text-2xl font-display font-bold text-brand-gold mb-2 text-center">"{inspiration.themeName}"</h5>
    <p className="text-center italic text-gray-300 mb-4">"{inspiration.planningTip}"</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div>
        <h6 className="font-semibold text-white mb-2">Color Palette</h6>
        <div className="flex space-x-2">
          {inspiration.colorPalette.map(color => (
            <div key={color} className="w-8 h-8 rounded-full border-2 border-gray-600" style={{ backgroundColor: color }} title={color}></div>
          ))}
        </div>
      </div>
       <div>
        <h6 className="font-semibold text-white mb-2">Signature Cocktail</h6>
        <p className="text-gray-300"><span className="font-bold text-brand-gold/90">{inspiration.signatureCocktail.name}:</span> {inspiration.signatureCocktail.description}</p>
      </div>
      <div>
        <h6 className="font-semibold text-white mb-2">Decor Ideas</h6>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {inspiration.decorIdeas.map(idea => <li key={idea}>{idea}</li>)}
        </ul>
      </div>
      <div>
        <h6 className="font-semibold text-white mb-2">Music Suggestions</h6>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {inspiration.musicSuggestions.map(music => <li key={music}>{music}</li>)}
        </ul>
      </div>
    </div>
  </div>
);

const Step2_Details: React.FC<{
    formData: BookingFormData;
    setField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
    onNext: () => void;
    onPrev: () => void;
    isValid: boolean;
}> = ({ formData, setField, onNext, onPrev, isValid }) => {
    const [isInspirationLoading, setIsInspirationLoading] = useState(false);
    const [inspirationData, setInspirationData] = useState<EventInspiration | null>(null);
    const [inspirationError, setInspirationError] = useState('');

    const handleGetInspiration = async () => {
        setIsInspirationLoading(true);
        setInspirationError('');
        setInspirationData(null);
        try {
            const result = await generateEventInspiration(formData.eventType, formData.details);
            setInspirationData(result);
        } catch (err: any) {
            setInspirationError(err.message);
        } finally {
            setIsInspirationLoading(false);
        }
    }

    return (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold text-white mb-6">Tell Us About Your Event</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
                <label className="block text-gray-300 mb-2">Event Type</label>
                <select name="eventType" onChange={e => setField('eventType', e.target.value)} value={formData.eventType} className="w-full bg-gray-700/50 text-white p-4 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none">
                    <option>Birthday Party</option>
                    <option>Corporate Event</option>
                    <option>Pop-up Mixer</option>
                    <option>Private Gathering</option>
                    <option>Wedding Reception</option>
                    <option>Other</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-300 mb-2">Number of Guests</label>
                <input type="number" name="guests" value={formData.guests} onChange={e => setField('guests', parseInt(e.target.value) || 0)} className="w-full bg-gray-700/50 text-white p-4 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none" min="1" />
            </div>
        </div>

        <div className="text-center my-6">
            <button onClick={handleGetInspiration} disabled={isInspirationLoading} className="px-5 py-2.5 border-2 border-dashed border-brand-green/50 text-brand-green/90 rounded-full hover:bg-brand-green/10 hover:border-brand-green transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">
                ✨ {isInspirationLoading ? 'Generating...' : 'Get AI Vibe Ideas'}
            </button>
        </div>
        {inspirationError && <p className="text-red-400 text-center animate-fade-in">{inspirationError}</p>}
        {inspirationData && <InspirationCard inspiration={inspirationData} />}

        <h4 className="text-2xl font-display font-semibold text-white mb-8 mt-12">Select a Package</h4>
        <div className="space-y-6">
            {VENUE_PACKAGES.map(pkg => (
                <div
                    key={pkg.id}
                    onClick={() => setField('selectedPackage', pkg)}
                    className={`group relative transition-all duration-700 ease-out cursor-pointer`}
                    style={{
                        transitionDelay: `${VENUE_PACKAGES.indexOf(pkg) * 100}ms`
                    }}
                >
                    {/* Subtle background line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left"></div>

                    <div className="relative flex items-center gap-x-8 py-6 border-b border-gray-800/50 group-hover:border-brand-gold/30 transition-colors duration-500">
                        {/* Package icon */}
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h5 className="text-2xl font-display font-semibold text-white mb-2 group-hover:text-brand-gold transition-colors duration-500">
                                {pkg.name}
                            </h5>
                            <p className="text-3xl font-bold text-brand-gold mb-3 group-hover:text-white transition-colors duration-500">
                                {pkg.price}
                            </p>
                            <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-500">
                                {pkg.description}
                            </p>
                            <ul className="text-sm text-gray-400 space-y-2 group-hover:text-gray-300 transition-colors duration-500">
                              {pkg.features.map((f, index) => (
                                <li key={index} className="flex items-center gap-x-2">
                                  <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full group-hover:bg-brand-gold transition-colors duration-500"></span>
                                  {f}
                                </li>
                              ))}
                            </ul>
                        </div>

                        {/* Selection indicator */}
                        <div className="flex-shrink-0">
                            {formData.selectedPackage?.id === pkg.id ? (
                                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-6 h-6 border-2 border-gray-600 rounded-full group-hover:border-brand-gold/60 transition-colors duration-500"></div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-8 flex justify-between">
            <button onClick={onPrev} className="text-gray-300 font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition-colors">Back</button>
            <button onClick={onNext} disabled={!isValid} className="btn-aurora bg-brand-gold text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">Next</button>
        </div>
    </div>
)};

const AnimatedInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }> = ({ label, error, ...props }) => {
    return (
        <div className="form-group relative pt-4">
            <input
                {...props}
                placeholder=" "
                className={`form-input w-full bg-gray-700/50 text-white p-4 rounded-md border ${error ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors peer`}
            />
            <label className="form-label absolute left-4 top-8 text-gray-400 pointer-events-none transition-all duration-300 ease-in-out origin-[0] peer-focus:text-brand-gold">{label}</label>
            {error && <p className="text-red-400 text-sm mt-1 absolute">{error}</p>}
        </div>
    );
};


const Step3_Info: React.FC<{
    formData: BookingFormData;
    setField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
    onSubmit: () => void;
    onPrev: () => void;
    isValid: boolean;
    errors: Partial<Record<keyof BookingFormData, string>>;
    onValidate: () => void;
}> = ({ formData, setField, onSubmit, onPrev, isValid, errors, onValidate }) => (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold text-white mb-6">Your Contact Information</h3>
        <div className="space-y-6">
            <AnimatedInput label="Full Name" type="text" name="name" value={formData.name} onChange={e => setField('name', e.target.value)} onBlur={onValidate} required error={errors.name} />
            <AnimatedInput label="Email Address" type="email" name="email" value={formData.email} onChange={e => setField('email', e.target.value)} onBlur={onValidate} required error={errors.email} />
            <AnimatedInput label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={e => setField('phone', e.target.value)} onBlur={onValidate} required error={errors.phone} />
            <textarea value={formData.details} onChange={e => setField('details', e.target.value)} placeholder="Any special requests or details (optional)..." rows={4} className="w-full bg-gray-700/50 text-white p-4 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"></textarea>
        </div>
        <div className="mt-8 flex justify-between items-center">
            <button onClick={onPrev} className="text-gray-300 font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition-colors">Back</button>
            <button onClick={onSubmit} disabled={!isValid} className="btn-aurora bg-brand-gold text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">Generate Quote</button>
        </div>
         {errors.details && <p className="text-red-400 text-center mt-4 animate-fade-in">{errors.details}</p>}
    </div>
);

const StripeForm: React.FC<{ onPayment: () => void, depositAmount: number }> = ({ onPayment, depositAmount }) => {
  const [paying, setPaying] = useState(false);
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      onPayment();
      setPaying(false);
    }, 2000);
  }
  return (
    <div className="mt-6 border-t border-gray-700 pt-6 animate-fade-in">
      <h4 className="font-bold text-white mb-4 text-lg">Secure Your Date</h4>
      <p className="text-sm text-gray-400 mb-4">A 50% deposit is required to lock in your booking. This is a UI demonstration; no real transaction will occur.</p>
      <form onSubmit={handlePay} className="space-y-3 p-4 bg-gray-900/50 rounded-lg">
        <input type="text" placeholder="Card Number" className="w-full bg-gray-700/50 text-white p-3 rounded-md border border-gray-600 focus:ring-1 focus:ring-brand-gold outline-none" />
        <div className="flex space-x-3">
            <input type="text" placeholder="MM / YY" className="w-1/2 bg-gray-700/50 text-white p-3 rounded-md border border-gray-600 focus:ring-1 focus:ring-brand-gold outline-none" />
            <input type="text" placeholder="CVC" className="w-1/2 bg-gray-700/50 text-white p-3 rounded-md border border-gray-600 focus:ring-1 focus:ring-brand-gold outline-none" />
        </div>
        <button type="submit" disabled={paying} className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-blue-500 transition-all duration-300 disabled:bg-gray-600">
          {paying ? 'Processing...' : `Pay $${(depositAmount / 2).toFixed(2)} Deposit`}
        </button>
      </form>
    </div>
  )
}

const DigitalEventPass: React.FC<{ formData: BookingFormData; quoteData: BookingQuote }> = ({ formData, quoteData }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const bookingId = useMemo(() => `S18NY-${Date.now().toString().slice(-6)}`, []);

    useEffect(() => {
        const passDetails = {
            bookingId,
            name: formData.name,
            event: formData.eventType,
            date: formData.date?.toLocaleDateString('en-US'),
            time: formData.timeSlot,
            guests: formData.guests,
            package: quoteData.quote.packageName,
        };

        QRCode.toDataURL(JSON.stringify(passDetails), {
            width: 200,
            margin: 2,
            color: {
                dark: '#FFFFFF',
                light: '#00000000'
            }
        })
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error("QR Code generation failed:", err));
    }, [formData, quoteData, bookingId]);

    return (
        <div className="mt-8 text-center animate-pop-in">
            <div className="pass-animated-border rounded-xl">
              <div className="relative bg-gray-900/50 p-6 rounded-xl">
                  <div className="absolute top-0 -left-4 w-8 h-8 bg-gray-800/60 rounded-full z-10"></div>
                  <div className="absolute top-0 -right-4 w-8 h-8 bg-gray-800/60 rounded-full z-10"></div>
                  <h4 className="font-bold text-brand-gold text-2xl font-display">Your Event is Booked!</h4>
                  <p className="text-gray-300 mt-2 mb-6">Save this Digital Event Pass for check-in.</p>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 text-left">
                      <div className="flex-shrink-0">
                          {qrCodeUrl ? (
                              <img src={qrCodeUrl} alt="Booking QR Code" className="bg-gray-700/50 p-2 rounded-lg" />
                          ) : (
                              <div className="w-[216px] h-[216px] bg-gray-700 animate-pulse rounded-lg"></div>
                          )}
                      </div>
                      <div className="w-full">
                          <h5 className="text-xl font-bold text-white">{formData.eventType}</h5>
                          <p className="text-brand-gold font-semibold text-lg">{formData.name}</p>
                          <div className="mt-4 border-t border-gray-700 pt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div><span className="text-gray-400 block">Date</span><span className="font-semibold">{formData.date?.toLocaleDateString('en-US')}</span></div>
                              <div><span className="text-gray-400 block">Time</span><span className="font-semibold">{formData.timeSlot}</span></div>
                              <div><span className="text-gray-400 block">Guests</span><span className="font-semibold">{formData.guests}</span></div>
                              <div><span className="text-gray-400 block">Package</span><span className="font-semibold">{quoteData.quote.packageName}</span></div>
                          </div>
                      </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-6">Booking ID: {bookingId}</p>
                  <div className="absolute bottom-0 -left-4 w-8 h-8 bg-gray-800/60 rounded-full z-10"></div>
                  <div className="absolute bottom-0 -right-4 w-8 h-8 bg-gray-800/60 rounded-full z-10"></div>
              </div>
            </div>
        </div>
    );
};

const Step4_Confirmation: React.FC<{ quoteData: BookingQuote, formData: BookingFormData }> = ({ quoteData, formData }) => {
  const [showStripe, setShowStripe] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const { success, error } = useToast();

  const handlePaymentSuccess = () => {
    setDepositPaid(true);
    setShowStripe(false);
  }

  const handleEmailQuery = async (quoteData: BookingQuote, formData: BookingFormData) => {
    setIsEmailLoading(true);
    try {
      const result = await sendBookingInquiry(formData, quoteData);
      
      if (result.success) {
        setEmailSent(true);
        success('Email Sent Successfully!', 'Your inquiry has been sent to our team. We\'ll respond within 24 hours.');
      } else {
        error('Email Failed', result.error || 'Failed to send your inquiry. Please try again.');
      }
    } catch (err) {
      error('Email Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
        {depositPaid ? (
          <DigitalEventPass quoteData={quoteData} formData={formData} />
        ) : (
          <>
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-brand-gold mb-2">Quote Generated!</h3>
                <p className="text-gray-300 max-w-2xl mx-auto">{quoteData.summary}</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <h4 className="font-bold text-brand-gold mb-4 text-xl border-b border-gray-700 pb-3">Your Preliminary Quote</h4>
                <div className="grid grid-cols-2 gap-4 text-lg">
                    <span className="text-gray-400">{quoteData.quote.packageName} ({quoteData.quote.guestCount} guests)</span>
                    <span className="text-right">${quoteData.quote.baseCost.toFixed(2)}</span>

                    {quoteData.quote.weekendSurcharge > 0 && (
                      <>
                        <span className="text-gray-400">Weekend Surcharge</span>
                        <span className="text-right">${quoteData.quote.weekendSurcharge.toFixed(2)}</span>
                      </>
                    )}
                    
                    <span className="text-white font-bold border-t border-gray-700 pt-3 mt-2">Total Estimate</span>
                    <span className="text-white font-bold text-right border-t border-gray-700 pt-3 mt-2">${quoteData.quote.totalEstimate.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-4 space-y-1">
                    {quoteData.quote.notes.map((note, i) => <p key={i}>* {note}</p>)}
                </div>
            </div>
            
            <div className="mt-8">
                <h4 className="font-bold text-white mb-3 text-lg">What's Next?</h4>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                    {quoteData.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>
            {!showStripe && !emailSent && (
              <div className="mt-8">
                <h4 className="font-bold text-white mb-6 text-lg text-center">Choose Your Next Step</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Lock in Date Option */}
                  <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6 hover:border-brand-gold/50 transition-all duration-300">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h5 className="text-xl font-semibold text-white mb-2">Lock in Your Date</h5>
                      <p className="text-gray-400 text-sm mb-4">Secure your preferred date with a 50% deposit. Your date will be reserved immediately.</p>
                      <div className="text-brand-gold font-bold text-lg mb-4">
                        ${(quoteData.quote.totalEstimate * 0.5).toFixed(2)} Deposit
                      </div>
                      <button 
                        onClick={() => setShowStripe(true)} 
                        className="w-full bg-brand-gold text-black font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                      >
                        Pay Deposit Now
                      </button>
                    </div>
                  </div>

                  {/* Negotiate Option */}
                  <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6 hover:border-brand-gold/50 transition-all duration-300">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h5 className="text-xl font-semibold text-white mb-2">Negotiate & Discuss</h5>
                      <p className="text-gray-400 text-sm mb-4">Send us your details to discuss custom packages, pricing, or special requirements.</p>
                      <div className="text-gray-300 font-medium text-sm mb-4">
                        Free Consultation
                      </div>
                      <button 
                        onClick={() => handleEmailQuery(quoteData, formData)} 
                        disabled={isEmailLoading}
                        className="w-full bg-transparent border-2 border-brand-gold text-brand-gold font-bold py-3 px-6 rounded-full hover:bg-brand-gold hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isEmailLoading ? (
                          <>
                            <LoadingSpinner size="sm" color="gold" />
                            Sending...
                          </>
                        ) : (
                          'Send Query via Email'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {emailSent && (
              <div className="mt-8 text-center">
                <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-8 max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-green-400 mb-2">Inquiry Sent Successfully!</h4>
                  <p className="text-gray-300 mb-4">
                    Your inquiry has been sent to our team and a confirmation email has been sent to your inbox. We'll review your details and get back to you within 24 hours to discuss your event and answer any questions.
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                    <h5 className="font-semibold text-white mb-2">What happens next?</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Our team will review your event details</li>
                      <li>• We'll contact you within 24 hours</li>
                      <li>• We'll discuss custom options and pricing</li>
                      <li>• We'll help you finalize your booking</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setEmailSent(false)} 
                    className="mt-6 text-brand-gold hover:text-white transition-colors duration-300"
                  >
                    ← Back to Options
                  </button>
                </div>
              </div>
            )}
            {showStripe && <StripeForm onPayment={handlePaymentSuccess} depositAmount={quoteData.quote.totalEstimate} />}
            <p className="text-sm text-gray-500 mt-8 text-center">Our team will be in touch via email shortly to finalize the details.</p>
          </>
        )}
    </div>
  );
}

export default Booking;