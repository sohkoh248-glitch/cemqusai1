import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, Gauge, Lightbulb, RotateCcw, ShieldCheck, Thermometer, Waves, Wind, FlaskConical } from 'lucide-react';
import boyleWorksheet from '@assets/1_1789848594898.webp';
import temperatureWorksheet from '@assets/2_1789848594898.webp';
import evaporationWorksheet from '@assets/3_1789848594897.webp';

type ExperimentKey = 'boyle' | 'temperature' | 'evaporation';

const experimentInfo: Record<ExperimentKey, { title: string; subtitle: string; icon: typeof Gauge; image: string }> = {
  boyle: { title: 'قانون بويل', subtitle: 'الحجم والضغط عند ثبات درجة الحرارة', icon: Gauge, image: boyleWorksheet },
  temperature: { title: 'حجم الغاز ودرجة الحرارة', subtitle: 'العلاقة عند ثبات الضغط', icon: Thermometer, image: temperatureWorksheet },
  evaporation: { title: 'سرعة التبخر', subtitle: 'كيف تغيّر الحرارة والزمن النتيجة؟', icon: Wind, image: evaporationWorksheet },
};

function Worksheet({ experiment }: { experiment: ExperimentKey }) {
  const item = experimentInfo[experiment];
  return (
    <aside className="worksheet-panel" data-testid={`panel-worksheet-${experiment}`}>
      <h4>من ورقة العمل إلى المختبر</h4>
      <div className="worksheet-frame">
        <img src={item.image} alt={`ورقة عمل تجربة ${item.title}`} data-testid={`img-worksheet-${experiment}`} />
      </div>
      <div>
        <p className="worksheet-caption">المرجع الأصلي للتجربة ظاهر هنا. غيّر المتغيرات في المحاكاة، ثم قارِن ملاحظاتك بالخطوات والجدول.</p>
        <div className="worksheet-label"><BookOpen size={13} /> ورقة النشاط الأصلية</div>
      </div>
    </aside>
  );
}

function ExperimentHeader({ experiment, onReset }: { experiment: ExperimentKey; onReset: () => void }) {
  const item = experimentInfo[experiment];
  const Icon = item.icon;
  return (
    <div className="experiment-head">
      <div className="experiment-title">
        <div className="experiment-title-icon"><Icon size={21} /></div>
        <div><h3>{item.title}</h3><p>{item.subtitle}</p></div>
      </div>
      <button className="reset-button" onClick={onReset} data-testid={`button-reset-${experiment}`}><RotateCcw size={14} /><span>إعادة التجربة</span></button>
    </div>
  );
}

function LabProgress({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="lab-progress" aria-label="مراحل التجربة">
      {labels.map((label, index) => (
        <div className={`progress-step ${index <= step ? 'is-active' : ''}`} key={label}>
          <span>{index + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function ConclusionCard({ observation, conclusion, ready, recorded }: { observation: string; conclusion: string; ready: boolean; recorded: string }) {
  return (
    <div className={`conclusion-card ${ready ? 'is-ready' : ''}`}>
      <div className="conclusion-heading">
        <div className="conclusion-icon"><Lightbulb size={18} /></div>
        <div><span>محطة الاستنتاج</span><h4>{ready ? 'أحسنت، هذه خلاصة ملاحظتك' : 'سجّل أكثر من قراءة لتصل إلى الاستنتاج'}</h4></div>
      </div>
      <div className="conclusion-body">
        <div><span>الملاحظة</span><p>{observation}</p></div>
        <div><span>الاستنتاج العلمي</span><p>{conclusion}</p></div>
      </div>
      <div className="recorded-note"><Waves size={14} /> {recorded}</div>
    </div>
  );
}

function BoyleExperiment() {
  const [volume, setVolume] = useState(20);
  const [readings, setReadings] = useState<number[]>([]);
  const pressure = 600 / volume;
  const inverse = 1 / pressure;
  const volumes = [10, 15, 20, 25, 30, 35, 40];
  const setV = (value: number) => setVolume(Math.min(40, Math.max(10, value || 10)));
  const registerReading = () => setReadings((current) => current.includes(volume) ? current : [...current, volume]);
  const progressStep = readings.length === 0 ? 0 : readings.length === 1 ? 1 : 2;
  const lowest = readings.length ? Math.min(...readings) : volume;
  const highest = readings.length ? Math.max(...readings) : volume;
  const ready = readings.length >= 2;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <LabProgress step={progressStep} labels={['غيّر الحجم', 'سجّل القراءة', 'استنتج']} />
        <div className="control-layout">
          <div>
            <div className="syringe-stage">
              <div className="gauge">{pressure.toFixed(1)} kPa</div>
              <div className="syringe">
                <div className="syringe-nozzle" />
                <div className="syringe-barrel"><div className="syringe-gas" style={{ width: `${((volume - 10) / 30) * 76 + 18}%` }} /><div className="syringe-ticks" /></div>
                <div className="syringe-plunger" style={{ transform: `translateX(-${(40 - volume) * 1.25}px)` }} />
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-title"><span>سجل القياسات</span><span className="chart-legend"><i style={{ color: 'hsl(37 75% 61%)' }}>■</i> الحجم&nbsp; <i style={{ color: 'hsl(8 70% 60%)' }}>■</i> الضغط</span></div>
              <div className="bars">{volumes.map((v) => <div className="bar-column" key={v}><div className="bar volume" style={{ height: `${(v / 40) * 75}%` }} /><div className="bar pressure" style={{ height: `${(600 / v / 6) * 75}%` }} /></div>)}</div>
              <div className="chart-labels">{volumes.map((v) => <span key={v}>{v}</span>)}</div>
            </div>
          </div>
          <div className="control-card">
            <h4>اسحب مكبس المحقن واختبر العلاقة</h4>
            <div className="label-row"><span>حجم الغاز</span><span className="value-pill" data-testid="value-volume">{volume} mL</span></div>
            <input type="range" min="10" max="40" step="5" value={volume} onChange={(event) => setV(Number(event.target.value))} data-testid="input-volume-slider" />
            <div className="range-scale"><span>10 mL</span><span>40 mL</span></div>
            <input className="number-input" type="number" min="10" max="40" step="5" value={volume} onChange={(event) => setV(Number(event.target.value))} aria-label="حجم الغاز بالمليلتر" data-testid="input-volume-number" />
            <button className="record-button" onClick={registerReading} data-testid="button-record-boyle"><BookOpen size={15} /> سجّل هذه القراءة</button>
            <div className="result-grid">
              <div className="result-tile"><span>الضغط</span><strong data-testid="value-pressure">{pressure.toFixed(1)} kPa</strong></div>
              <div className="result-tile"><span>1 ÷ الضغط</span><strong data-testid="value-inverse">{inverse.toFixed(3)}</strong></div>
              <div className="result-tile"><span>ثابت التجربة</span><strong>600</strong></div>
            </div>
            <div className="reading-list">
              <span>القراءات المسجلة</span>
              <div>{readings.length ? readings.map((reading) => <b key={reading}>{reading} mL</b>) : <em>لم تُسجّل قراءة بعد</em>}</div>
            </div>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `عند تقليل الحجم من ${highest} mL إلى ${lowest} mL ارتفع الضغط من ${(600 / highest).toFixed(1)} إلى ${(600 / lowest).toFixed(1)} kPa.` : 'حرّك المكبس بين قيمتين مختلفتين، ثم سجّل كل قراءة للمقارنة.'}
          conclusion={ready ? 'عند ثبات درجة الحرارة، يتناسب ضغط الغاز عكسياً مع حجمه؛ كلما قلّ الحجم زاد الضغط، ويبقى حاصل الضرب قريباً من ثابت التجربة.' : 'البيانات لم تكتمل بعد. اجمع قراءتين على الأقل قبل كتابة الاستنتاج.'}
          recorded={readings.length ? `تم تسجيل ${readings.length} ${readings.length === 1 ? 'قراءة' : 'قراءات'}.` : 'ابدأ بقياس الحجم الحالي.'}
        />
      </div>
      <Worksheet experiment="boyle" />
    </div>
  );
}

function TemperatureExperiment() {
  const [temperature, setTemperature] = useState(6);
  const [readings, setReadings] = useState<number[]>([]);
  const bath = temperature <= 10 ? 'ice' : temperature >= 35 ? 'warm' : 'middle';
  const values = { temp: temperature, volume: 78 + temperature * 2.75, size: .72 + temperature * .0105, label: bath === 'ice' ? 'حمام ثلجي' : bath === 'warm' ? 'حمام مائي ساخن' : 'حمام معتدل' };
  const registerReading = () => setReadings((current) => current.includes(temperature) ? current : [...current, temperature]);
  const ready = readings.length >= 2;
  const colder = readings.length ? Math.min(...readings) : temperature;
  const warmer = readings.length ? Math.max(...readings) : temperature;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <div className="bath-switch" role="tablist" aria-label="اختيار الحمام">
          <button className={`bath-button ${bath === 'ice' ? 'active' : ''}`} onClick={() => setTemperature(6)} data-testid="button-ice-bath">الحمام الثلجي</button>
          <button className={`bath-button ${bath === 'middle' ? 'active' : ''}`} onClick={() => setTemperature(25)} data-testid="button-middle-bath">حمام معتدل</button>
          <button className={`bath-button ${bath === 'warm' ? 'active' : ''}`} onClick={() => setTemperature(48)} data-testid="button-warm-bath">الماء الساخن</button>
        </div>
        <LabProgress step={readings.length === 0 ? 0 : readings.length === 1 ? 1 : 2} labels={['اختر الحرارة', 'سجّل الحجم', 'استنتج']} />
        <div className="control-layout">
          <div className="balloon-stage">
            <div className="balloon" style={{ transform: `scale(${values.size})` }} />
            <div className="bath-caption"><span>{values.label}</span><span>الضغط ثابت</span></div>
          </div>
          <div className="control-card">
            <h4>اضبط الحرارة وراقب البالون</h4>
            <div className="label-row"><span>درجة حرارة الحمام</span><span className="value-pill">{temperature}°C</span></div>
            <input type="range" min="0" max="60" step="1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} data-testid="input-temperature-slider" />
            <div className="range-scale"><span>0°C</span><span>60°C</span></div>
            <div className="result-grid">
              <div className="result-tile"><span>درجة الحرارة</span><strong data-testid="value-temperature">{values.temp}°C</strong></div>
              <div className="result-tile"><span>حجم البالون</span><strong data-testid="value-balloon-volume">{values.volume.toFixed(0)} mL</strong></div>
              <div className="result-tile"><span>الحالة</span><strong>{bath === 'ice' ? 'منكمش' : bath === 'warm' ? 'متمدّد' : 'متوسط'}</strong></div>
            </div>
            <button className="record-button" onClick={registerReading} data-testid="button-record-temperature"><BookOpen size={15} /> سجّل هذه القراءة</button>
            <div className="reading-list"><span>الحرارات المسجلة</span><div>{readings.length ? readings.map((reading) => <b key={reading}>{reading}°C</b>) : <em>لم تُسجّل قراءة بعد</em>}</div></div>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `عند رفع الحرارة من ${colder}°C إلى ${warmer}°C تغيّر حجم البالون من ${(78 + colder * 2.75).toFixed(0)} إلى ${(78 + warmer * 2.75).toFixed(0)} mL.` : 'اختر درجة حرارة منخفضة ثم درجة أعلى، وسجّل حجم البالون في الحالتين.'}
          conclusion={ready ? 'عند ثبات الضغط، يزداد حجم الغاز بزيادة درجة حرارته؛ لأن جسيماته تتحرك أسرع فيحتاج الغاز إلى حيز أكبر.' : 'الاستنتاج يظهر بعد تسجيل قراءتين لدرجتي حرارة مختلفتين.'}
          recorded={readings.length ? `تم تسجيل ${readings.length} ${readings.length === 1 ? 'قراءة' : 'قراءات'}.` : 'ابدأ بحمام ثلجي أو حمام ساخن.'}
        />
      </div>
      <Worksheet experiment="temperature" />
    </div>
  );
}

function EvaporationExperiment() {
  const [temperature, setTemperature] = useState(40);
  const [minutes, setMinutes] = useState(5);
  const [simulatedMinutes, setSimulatedMinutes] = useState(5);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSimulatedMinutes((current) => {
        if (current >= minutes) {
          setRunning(false);
          return current;
        }
        return current + 1;
      });
    }, 700);
    return () => window.clearInterval(timer);
  }, [running, minutes]);
  const observedMinutes = running ? simulatedMinutes : minutes;
  const ethanolRate = .12 + temperature * .022;
  const waterRate = .04 + temperature * .007;
  const ethanolRemaining = Math.max(0.5, 10 - ethanolRate * observedMinutes);
  const waterRemaining = Math.max(1, 10 - waterRate * observedMinutes);
  const progress = (value: number) => `${Math.min(92, Math.max(5, ((10 - value) / 10) * 100))}%`;
  const startSimulation = () => { setSimulatedMinutes(0); setHasRun(true); setRunning(true); };
  const ready = hasRun && observedMinutes >= 3;
  const faster = ethanolRemaining < waterRemaining;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <LabProgress step={running ? 1 : hasRun ? 2 : 0} labels={['اضبط الظروف', 'شغّل التجربة', 'استنتج']} />
        <div className="evap-grid">
          <div className="evap-controls">
            <div className="control-card">
              <h4>اضبط ظروف التجربة</h4>
              <label className="label-row" htmlFor="evap-temperature"><span>درجة حرارة الحمام</span><span className="value-pill">{temperature}°C</span></label>
              <input id="evap-temperature" type="range" min="15" max="40" step="1" value={temperature} disabled={running} onChange={(event) => setTemperature(Number(event.target.value))} data-testid="input-evap-temperature" />
              <div className="range-scale"><span>15°C</span><span>40°C</span></div>
              <label className="label-row" htmlFor="evap-time" style={{ marginTop: 17 }}><span>زمن الانتظار</span><span className="value-pill">{minutes} دقائق</span></label>
              <input id="evap-time" type="range" min="1" max="10" value={minutes} disabled={running} onChange={(event) => setMinutes(Number(event.target.value))} data-testid="input-evap-time" />
              <div className="range-scale"><span>دقيقة</span><span>10 دقائق</span></div>
              <button className="record-button primary-record" onClick={startSimulation} disabled={running} data-testid="button-run-evaporation"><Waves size={15} /> {running ? `المحاكاة تعمل... ${observedMinutes}/${minutes}` : 'شغّل المحاكاة'}</button>
            </div>
            <p className="formula-note"><b>الزمن المحاكى:</b> {hasRun ? `${observedMinutes} دقائق من أصل ${minutes}` : 'لم تبدأ المحاكاة بعد'}. قارن الكمية المتبقية، لا شكل الوعاء فقط.</p>
          </div>
          <div className="beaker-stage">
            <div className="beaker-wrap"><div className="beaker"><div className="vapor" /><div className="liquid liquid-ethanol" style={{ height: progress(ethanolRemaining) }} /></div><div className="beaker-label">الإيثانول</div><div className="beaker-volume" data-testid="value-ethanol">{ethanolRemaining.toFixed(1)} mL متبقٍ</div></div>
            <div className="beaker-wrap"><div className="beaker"><div className="vapor" /><div className="liquid liquid-water" style={{ height: progress(waterRemaining) }} /></div><div className="beaker-label">الماء</div><div className="beaker-volume" data-testid="value-water">{waterRemaining.toFixed(1)} mL متبقٍ</div></div>
          </div>
        </div>
        <div className="result-grid" style={{ marginTop: 18 }}>
          <div className="result-tile"><span>تبخر الإيثانول</span><strong>{(10 - ethanolRemaining).toFixed(1)} mL</strong></div>
          <div className="result-tile"><span>تبخر الماء</span><strong>{(10 - waterRemaining).toFixed(1)} mL</strong></div>
          <div className="result-tile"><span>النتيجة</span><strong>{faster ? 'الإيثانول أسرع' : 'قارن القيم'}</strong></div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `بعد ${observedMinutes} دقائق وعند ${temperature}°C بقي ${ethanolRemaining.toFixed(1)} mL من الإيثانول و${waterRemaining.toFixed(1)} mL من الماء.` : 'اضبط الحرارة والزمن، ثم شغّل المحاكاة حتى تظهر مقارنة واضحة.'}
          conclusion={ready ? 'الإيثانول يتبخر أسرع من الماء في هذه الظروف، كما أن رفع درجة الحرارة يزيد كمية السائل المتبخرة خلال الزمن نفسه.' : 'الاستنتاج يظهر بعد تشغيل التجربة لمدة كافية.'}
          recorded={running ? 'المحاكاة تجمع البيانات الآن.' : hasRun ? `اكتملت قراءة زمنية مقدارها ${observedMinutes} دقائق.` : 'لم تُجمع بيانات بعد.'}
        />
      </div>
      <Worksheet experiment="evaporation" />
    </div>
  );
}

function App() {
  const [experiment, setExperiment] = useState<ExperimentKey>('boyle');
  const [resetKey, setResetKey] = useState(0);
  const scrollToExperiments = () => document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToGuide = () => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
  const chooseExperiment = (key: ExperimentKey) => { setExperiment(key); setResetKey((keyValue) => keyValue + 1); window.setTimeout(scrollToExperiments, 20); };
  return (
    <div className="lab-page" dir="rtl">
      <header className="site-header">
        <div className="header-bar">
          <a href="#top" className="brand" data-testid="link-home">
            <div className="brand-mark"><FlaskConical size={24} /></div>
            <div><span className="brand-title">مختبرك الكيميائي</span><span className="brand-subtitle">تجارب تفاعلية باللغة العربية</span></div>
          </a>
          <nav className="header-nav" aria-label="التنقل الرئيسي">
            <button className={experiment === 'boyle' ? 'active' : ''} onClick={() => chooseExperiment('boyle')} data-testid="nav-boyle">التجارب</button>
            <button onClick={scrollToGuide} data-testid="nav-guide">دليل المختبر</button>
          </nav>
          <div className="header-note"><span className="signal-dot" /> جلسة تعلّم نشطة</div>
        </div>
      </header>
      <main className="page-main" id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">دفتر المختبر الرقمي · الصف المدرسي</div>
            <h1>حوّل الملاحظة إلى <em>اكتشاف.</em></h1>
            <p className="hero-text">هنا لا نكتفي بقراءة القانون. غيّر المتغير بيدك، شاهد أثره أمامك، وسجّل ما فهمته كما يفعل الكيميائي الحقيقي.</p>
            <div className="hero-actions"><button className="primary-button" onClick={scrollToExperiments} data-testid="button-start-lab">ابدأ التجربة <ChevronDown size={17} /></button><button className="ghost-button" onClick={scrollToGuide} data-testid="button-safety-guide"><ShieldCheck size={16} /> إرشادات السلامة</button></div>
          </div>
          <div className="hero-card">
            <span className="card-kicker">مهمتك اليوم</span><div className="lab-scribble">لاحظ ← غيّر ← استنتج</div>
            <h2>ثلاث تجارب، ومتغير واحد في كل مرة.</h2>
            <div className="mini-stats"><div className="mini-stat"><strong>03</strong><span>تجارب تفاعلية</span></div><div className="mini-stat"><strong>∞</strong><span>طريقة للملاحظة</span></div></div>
            <p className="formula-note">ابدأ بقانون بويل، ثم انتقل إلى الحرارة والتبخر. كل نتيجة هنا قابلة لإعادة التجربة.</p>
          </div>
        </section>

        <section className="experiment-picker" id="experiments">
          <div className="section-heading"><div><h2>أي سؤال ستختبر؟</h2><p>اختر محطة من محطات المختبر وابدأ بتغيير المتغير.</p></div><span className="card-kicker">المحطة {experiment === 'boyle' ? '01' : experiment === 'temperature' ? '02' : '03'} / 03</span></div>
          <div className="experiment-tabs">
            {(Object.keys(experimentInfo) as ExperimentKey[]).map((key, index) => { const item = experimentInfo[key]; const Icon = item.icon; return <button key={key} className={`experiment-tab ${experiment === key ? 'active' : ''}`} onClick={() => chooseExperiment(key)} data-testid={`tab-experiment-${key}`}><div className="tab-icon"><Icon size={19} /></div><div className="tab-text"><strong>{item.title}</strong><span>محطة {String(index + 1).padStart(2, '0')} · تفاعلية</span></div></button>; })}
          </div>
          <div className="experiment-shell">
            <ExperimentHeader experiment={experiment} onReset={() => setResetKey((key) => key + 1)} />
            {experiment === 'boyle' && <BoyleExperiment key={`boyle-${resetKey}`} />}
            {experiment === 'temperature' && <TemperatureExperiment key={`temperature-${resetKey}`} />}
            {experiment === 'evaporation' && <EvaporationExperiment key={`evaporation-${resetKey}`} />}
          </div>
        </section>

        <section className="steps-section" id="guide">
          <div className="section-heading"><div><h2>طريقة العالم الصغير</h2><p>ثلاث عادات تجعل كل تجربة أوضح وأكثر أماناً.</p></div></div>
          <div className="steps">
            <div className="step"><span className="step-number">١</span><div><h4>توقّع قبل أن تغيّر</h4><p>اكتب في ذهنك ماذا سيحدث. التوقع يجعل الفرق مرئياً، حتى لو خالف النتيجة.</p></div></div>
            <div className="step"><span className="step-number">٢</span><div><h4>غيّر متغيراً واحداً</h4><p>ثبّت بقية الظروف حتى تعرف سبب التغيير الحقيقي في الحجم أو الضغط أو التبخر.</p></div></div>
            <div className="step"><span className="step-number">٣</span><div><h4>لاحظ ثم استنتج</h4><p>اقرأ القيم، قارنها بالجدول، ثم صغ النتيجة بجملة من كلماتك أنت.</p></div></div>
          </div>
          <div className="callout"><ShieldCheck size={18} /><span><strong>سلامتك أولاً:</strong> اتبع تعليمات المعلم دائماً، ارتدِ النظارات الواقية، ولا تلمس المواد الكيميائية مباشرة. هذه المحاكاة للتعلم الآمن قبل التجربة الواقعية.</span></div>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-inner"><span>مختبرك الكيميائي · مساحة فضول آمنة</span><span><strong>حقوق الموقع محفوظة لـ قصي</strong> · بدعم من الأستاذ أحمد العمرو</span></div></footer>
    </div>
  );
}

export default App;
