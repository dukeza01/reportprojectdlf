/* ============================================================
   script.js — ระบบรายงานผลการดำเนินงานโครงการ พ.ศ. 2569
   แยกออกมาจาก ReportProject_2569.html เพื่อให้ง่ายต่อการจัดการ

   หมายเหตุการแก้ไข:
   - ลบฟังก์ชัน authLogin()/authRegister() รุ่นเก่าที่ซ้ำซ้อนออกแล้ว
     (โค้ดรุ่นเก่าอ้างอิง input id เช่น regName/regEmail ที่ไม่มีอยู่ใน
     HTML จริงและถูก window.authLogin ชุด Firebase ทับอยู่แล้ว จึงไม่
     เคยถูกเรียกใช้งานจริง — ระบบ Login/สมัครสมาชิกที่ใช้งานจริงคือ
     ชุด Firebase + GAS + Local fallback ท้ายไฟล์นี้ ซึ่งบันทึกและ
     แสดง ชื่อ-นามสกุล และตำแหน่ง ของผู้ล็อกอินในประวัติการแก้ไขอยู่แล้ว)
   ============================================================ */

// ===== DATA =====
let projects = [
  {id:1,name:'พัฒนาแพลตฟอร์มการเรียนรู้ (DLTV Learning Platform) ระยะที่ 2',strategy:'1',budget:17000000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:2,name:'ผลิตสื่อในรูปแบบดิจิทัลเพื่อการเรียนรู้',strategy:'1',budget:20000000,spent:0,po:0,status:'progress',result:'ผลิตสื่อฯ ระดับ ป.1-6 ใน 4 กลุ่มสาระการเรียนรู้ จำนวน 290 ชิ้น\nกิจกรรมที่ดำเนินการแล้ว:\n1. ขออนุมัติดำเนินโครงการและกรอบวงเงินงบประมาณ 20,000,000 บาท\n2. กำหนดข้อกำหนดคุณลักษณะ ขอบเขตงานและราคากลาง 8,000,000 บาท',kpi:['ผลิตสื่อ 290 ชิ้น (ป.1-6)','ครอบคลุม 4 กลุ่มสาระการเรียนรู้'],problems:'',solutions:'',quarter:'2'},
  {id:3,name:'ผลิตสื่อดิจิทัล ระดับประถมศึกษา (ป.3-ป.6) โดยครูสอนออกอากาศห้องเรียนต้นทาง',strategy:'1',budget:978000,spent:0,po:0,status:'progress',result:'ครูสอนออกอากาศห้องเรียนต้นทาง ดำเนินการทบทวนผลการจัดการเรียนรู้รายชั่วโมง เพื่อนำมาวิเคราะห์ตัวชี้วัด/มาตรฐานการเรียนรู้',kpi:['Content Specifications ครบทุกวิชา'],problems:'',solutions:'',quarter:'2'},
  {id:4,name:'ผลิตสื่อการเรียนรู้ดิจิทัล DLTV Plus',strategy:'1',budget:20000000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:5,name:'ผลิตสื่อการเรียนรู้ดิจิทัลเพื่อเสริมสร้างคุณลักษณะสำคัญตามพระบรมราโชบายด้านการศึกษา',strategy:'1',budget:10000000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:6,name:'ผลิตและสรรหาสื่อรายการเพื่อการเรียนรู้ตลอดชีวิตและการแนะแนวอาชีพ สำหรับเผยแพร่ทางสถานี DLTV',strategy:'1',budget:300000,spent:0,po:0,status:'progress',result:'อยู่ระหว่างดำเนินโครงการ\nกิจกรรมที่ 1: ผลิตรายการแนะนำอาชีพ "รู้จักอาชีพ สร้างอนาคต" กำหนด 6 อาชีพ\nกิจกรรมที่ 2: สรรหาสื่อรายการจาก 17 หน่วยงาน 18 รายการ รวม 1,137 ตอน',kpi:['ผลิตรายการอาชีพ 6 รายการ','สรรหาสื่อ ≥1,000 ตอน'],problems:'',solutions:'',quarter:'2'},
  {id:7,name:'พัฒนาระบบผลิตรายการและระบบออกอากาศ ระยะที่ 1 และ ระยะที่ 2',strategy:'2',budget:101000000,spent:0,po:0,status:'progress',result:'อยู่ระหว่างดำเนินโครงการ\nกิจกรรมที่ 1: แต่งตั้งคณะกรรมการดำเนินงาน ดำเนินการแล้ว\nกิจกรรมที่ 2: กำหนดขอบเขตงานคุณลักษณะและราคากลาง ดำเนินการแล้ว\nกิจกรรมที่ 3: วันที่ 12 ก.พ.2569 รับซองเอกสาร TOR (ประกาศ 10 วันทำการ)',kpi:['ระบบผลิตรายการทดแทนระบบเก่า','ระบบออกอากาศ HD คุณภาพสูง'],problems:'',solutions:'',quarter:'2'},
  {id:8,name:'นิเทศ ติดตาม และประเมินผลภายในการจัดการเรียนการสอนของครูห้องเรียนต้นทางฯ',strategy:'2',budget:2083000,spent:0,po:0,status:'progress',result:'กิจกรรมที่ดำเนินการแล้ว:\n1. การประเมินความพร้อมครูผู้ช่วย 3 ครั้ง (ม.ค.-ก.พ.2569)\n2. นิเทศการสอนครู กลุ่มสาระคณิตศาสตร์ วิทยาศาสตร์และเทคโนโลยี 2 ครั้ง\n3. ตรวจเทปการสอนก่อนออกอากาศ ระดับปฐมวัย-มัธยมต้น จำนวน 746 เทป',kpi:['นิเทศครู ≥2 ครั้ง/ภาคเรียน','ตรวจเทปการสอน ≥700 เทป','ครูผ่านการประเมิน ≥80%'],problems:'',solutions:'',quarter:'2'},
  {id:9,name:'พัฒนาความสามารถในการจัดการเรียนการสอนของครูสอนออกอากาศห้องเรียนต้นทาง',strategy:'2',budget:964000,spent:26720,po:0,status:'done',result:'กิจกรรมที่ดำเนินการแล้ว:\n1. สำรวจความต้องการในการพัฒนาตนเองของครู\n2. วิเคราะห์ผลความต้องการเพื่อวางแผนพัฒนาอย่างเป็นระบบ\n3. ประชุมเชิงปฏิบัติการ "แนวการพิจารณาการใช้สื่อที่ไม่ละเมิดลิขสิทธิ์" 19 ม.ค.2569\n4. ประเมินผลและสรุปรายงานผล',kpi:['ครูเข้าร่วมอบรม ≥90%','ความพึงพอใจ ≥80%'],problems:'',solutions:'',quarter:'2'},
  {id:10,name:'สนับสนุนชุดกิจกรรมการเรียนรู้ (ใบงานและใบความรู้) สำหรับนักเรียนโรงเรียนปลายทาง',strategy:'3',budget:100000000,spent:0,po:0,status:'progress',result:'กลุ่มวิชาการ มูลนิธิฯ ดำเนินงาน:\n1. จัดเตรียม file ชุดกิจกรรมฯ ต้นฉบับ ภาคเรียนที่ 1\n2. ตรวจสอบจำนวนนักเรียน 299,613 คน รวม 1,797,678 เล่ม\n3. กำหนด TOR ราคากลาง 35,000,000 บาท อยู่ระหว่างดำเนินการจัดจ้าง',kpi:['จัดสรรชุดกิจกรรม 1,797,678 เล่ม','ครอบคลุมนักเรียน 299,613 คน','ส่งถึงโรงเรียนทันภาคเรียน'],problems:'',solutions:'',quarter:'2'},
  {id:11,name:'คัดเลือกโรงเรียนที่มีวิธีปฏิบัติที่เป็นเลิศ (Best Practice School)',strategy:'3',budget:11675000,spent:0,po:0,status:'progress',result:'กลุ่มวิชาการ มูลนิธิฯ อยู่ระหว่างร่างเครื่องมือประเมินการคัดเลือกโรงเรียนที่มีวิธีปฏิบัติที่เป็นเลิศ (Best Practice School)',kpi:['คัดเลือกโรงเรียน Best Practice ≥20 แห่ง'],problems:'',solutions:'',quarter:'2'},
  {id:12,name:'ทุนการศึกษาพระราชทาน มูลนิธิฯ เนื่องในโอกาสมหามงคลเฉลิมพระชนมพรรษา',strategy:'3',budget:4171000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:13,name:'สนับสนุนคู่มือครู-แผนการจัดการเรียนรู้ และชุดกิจกรรมฯ ในรูปแบบ Flash drive',strategy:'3',budget:3000000,spent:0,po:0,status:'progress',result:'กลุ่มวิชาการ มูลนิธิฯ ดำเนินงาน:\n1. สำรวจความต้องการใช้คู่มือครูฯ จากต้นสังกัด สพฐ. ตชด. และโรงเรียนวังไกลกังวลฯ\n2. รวบรวมไฟล์คู่มือครูทั้ง 3 ระดับ',kpi:['จัดส่ง Flash drive ครอบคลุมทุกโรงเรียนปลายทาง'],problems:'',solutions:'',quarter:'2'},
  {id:14,name:'ส่งเสริมความรู้ความเข้าใจการบริหารจัดการและกระบวนการจัดการเรียนรู้โดยใช้ DLTV',strategy:'3',budget:1500000,spent:0,po:0,status:'progress',result:'กิจกรรมอยู่ระหว่างดำเนินการ:\n1. ร่างหัวเรื่องและกรอบเนื้อหาในการผลิตสื่อเพื่อส่งเสริมความรู้ฯ\n2. ประชุมผู้ทรงคุณวุฒิพิจารณาหัวเรื่อง/กรอบเนื้อหา',kpi:['ผลิตสื่อส่งเสริมความรู้ DLTV ≥3 ชุด','ฝึกอบรมครูปลายทาง ≥100 คน'],problems:'',solutions:'',quarter:'2'},
  {id:15,name:'ประเมินโรงเรียนปลายทางเป้าหมายการประเมิน',strategy:'3',budget:739000,spent:0,po:0,status:'done',result:'กิจกรรมที่ดำเนินการแล้ว:\n1. จัดทำร่างหลักเกณฑ์และเครื่องมือการประเมิน 7 รายการ\n2. อยู่ระหว่างพิจารณาหลักเกณฑ์เพื่อนำไปทดลองใช้ (Try out) กับโรงเรียนตัวอย่าง',kpi:['เครื่องมือประเมิน 7 รายการ','ทดลองใช้กับโรงเรียนตัวอย่าง ≥10 แห่ง'],problems:'',solutions:'',quarter:'1'},
  {id:16,name:'ส่งเสริมการเรียนรู้โดยใช้สื่อที่บูรณาการศาสตร์พระราชาและน้อมนำพระบรมราโชบายสู่การจัดการเรียนการสอน',strategy:'3',budget:80000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:17,name:'สร้างความร่วมมือและความสัมพันธ์ที่ดีในองค์กร',strategy:'4',budget:2250000,spent:0,po:0,status:'progress',result:'อยู่ระหว่างดำเนินการ:\nนำเสนอหลักสูตร MBTI เปรียบเทียบ 3 บริษัท กลุ่มเป้าหมาย 230 คน ประมาณการค่าใช้จ่าย 1,950,000 บาท',kpi:['บุคลากรเข้าร่วม 230 คน','ความพึงพอใจ ≥80%','สร้างความเข้าใจบุคลิกภาพ 16 แบบ'],problems:'',solutions:'',quarter:'2'},
  {id:18,name:'พัฒนาทักษะความรู้เพื่อเพิ่มประสิทธิภาพการปฏิบัติงาน',strategy:'4',budget:245000,spent:0,po:0,status:'progress',result:'ประกอบด้วย 4 กิจกรรม:\nกิจกรรม 1: ส่งเสริมการจัดการความรู้ภายในองค์กร (KM) — ดำเนินการแล้ว มีวิดีโอ 2 รายการ\nกิจกรรม 4: อบรม AI สร้างสรรค์ภาพประกอบสื่อการสอน 12–14 พ.ค.2569 (11 คน)',kpi:['อบรม AI สำหรับสื่อการสอน 11 คน','ศึกษาดูงาน ≥1 แห่ง','ผลิตวิดีโอ KM ≥2 รายการ'],problems:'',solutions:'',quarter:'2'},
  {id:19,name:'จัดทำคู่มือและมาตรฐานการปฏิบัติงานเพื่อเพิ่มประสิทธิภาพการบริหารจัดการ',strategy:'4',budget:263000,spent:0,po:0,status:'progress',result:'อยู่ระหว่างดำเนินการ:\nผ่านการอนุมัติกรอบงบประมาณและวิเคราะห์ความเสี่ยงแล้ว อยู่ระหว่างออกแบบสำรวจและปรับปรุง JD',kpi:['คู่มือมาตรฐานการปฏิบัติงาน ≥10 ฉบับ','JD อัปเดตครบทุกตำแหน่ง'],problems:'',solutions:'',quarter:'2'},
  {id:20,name:'บำเพ็ญสาธารณประโยชน์',strategy:'4',budget:65000,spent:17276,po:0,status:'done',result:'ดำเนินการไปแล้ว 3 กิจกรรม:\n1. ร่วมถวายความอาลัยฯ ประดับผ้าขาว-ดำ จัดทำริบบิ้น ต.ค.2568 (5,850 บาท)\n2. ทำบุญประจำปีศาลเสด็จพ่อกรมหลวงชุมพรฯ 15 ธ.ค.2568 (ไม่ใช้งบ)\n3. ร่วมพระพิธีธรรมสวดพระอภิธรรม 12 ก.พ.2569 (11,426 บาท)',kpi:['บุคลากรร่วมกิจกรรม ≥95%','ดำเนินกิจกรรม ≥3 กิจกรรม'],problems:'',solutions:'',quarter:'1'},
  {id:21,name:'สร้างการรับรู้และประชาสัมพันธ์องค์กร',strategy:'4',budget:630000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:22,name:'อบรมความรู้หลักสูตรระยะสั้นเพื่อการเรียนรู้ตลอดชีวิต',strategy:'4',budget:220000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:23,name:'ขับเคลื่อนแผนยุทธศาสตร์ของมูลนิธิฯ ไปสู่การปฏิบัติ งบประมาณประจำปี พ.ศ. 2569',strategy:'4',budget:674000,spent:0,po:0,status:'pending',result:'',kpi:[],problems:'',solutions:'',quarter:'all'},
  {id:24,name:'งบบริหารสำนักงานประจำปี 2569',strategy:'5',budget:12000000,spent:3200000,po:1500000,status:'progress',result:'เบิกจ่ายค่าใช้จ่ายประจำสำนักงาน ไตรมาส 1-2 เรียบร้อยแล้ว',kpi:['เบิกจ่ายทันตามกำหนด','งบประมาณเพียงพอตลอดปี'],problems:'',solutions:'',quarter:'2'},
  {id:25,name:'ค่าใช้จ่ายบุคลากรและสวัสดิการ',strategy:'5',budget:8500000,spent:4250000,po:0,status:'progress',result:'จ่ายเงินเดือนและสวัสดิการบุคลากรไตรมาส 1-2 ครบถ้วน',kpi:['จ่ายเงินเดือนครบทุกเดือน','สวัสดิการครบตามสัญญา'],problems:'',solutions:'',quarter:'2'},
  {id:26,name:'ค่าซ่อมบำรุงและครุภัณฑ์สำนักงาน',strategy:'5',budget:2000000,spent:0,po:450000,status:'progress',result:'อยู่ระหว่างดำเนินการจัดซื้อครุภัณฑ์ตามแผน',kpi:['ครุภัณฑ์พร้อมใช้งาน 100%'],problems:'',solutions:'',quarter:'2'}
];

// ===== CONSTANTS =====
const S_NAMES = {1:'ยุทธศาสตร์ที่ 1',2:'ยุทธศาสตร์ที่ 2',3:'ยุทธศาสตร์ที่ 3',4:'ยุทธศาสตร์ที่ 4',5:'งบบริหารสำนักงาน'};
const S_FULL  = {1:'การพัฒนาการจัดการศึกษาทางไกล',2:'การพัฒนาครูและโรงเรียนต้นทาง',3:'การพัฒนาครูและโรงเรียนปลายทาง',4:'การพัฒนาระบบการบริหารจัดการ',5:'งบดำเนินการสำนักงาน'};
const S_COLORS= {1:'#3b72f0',2:'#059669',3:'#d97706',4:'#9333ea',5:'#0891b2'};
const S_BADGE = {1:'badge-s1',2:'badge-s2',3:'badge-s3',4:'badge-s4',5:'badge-s5'};
const S_KEYS  = [1,2,3,4,5];
const STATUS_LABEL = {done:'แล้วเสร็จ',progress:'อยู่ระหว่างดำเนิน',pending:'ยังไม่เริ่ม'};
const STATUS_CLASS  = {done:'badge-done',progress:'badge-progress',pending:'badge-pending'};
const Q_LABEL = {all:'ทุกไตรมาส','1':'ไตรมาส 1 (ต.ค.–ธ.ค. 68)','2':'ไตรมาส 2 (ม.ค.–มี.ค. 69)','3':'ไตรมาส 3 (เม.ย.–มิ.ย. 69)','4':'ไตรมาส 4 (ก.ค.–ก.ย. 69)'};

let editingId = null, deleteId = null, currentPage = 1;
const PAGE_SIZE = 10;
let tempKPIs = [];
let chartBudget = null, chartStatus = null, chartUtilization = null, chartBudgetGauge = null, chartCommitteeBudget = null;
let currentQuarter = 'all';

// ===== UTILS =====
function fmt(n) {
  n = n||0;
  return Math.round(n).toLocaleString('th-TH');
}
function fmtFull(n) { return (n||0).toLocaleString('th-TH'); }

function showToast(msg, dur=2500) {
  // ── inject styles once ──────────────────────────────────────
  if (!document.getElementById('_ntfSt')) {
    const s = document.createElement('style');
    s.id = '_ntfSt';
    s.textContent = `
      @keyframes _ntfIn  { 0%{opacity:0;transform:translateY(-28px) scale(.9)} 55%{transform:translateY(4px) scale(1.03)} 100%{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes _ntfOut { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-20px) scale(.92)} }
      @keyframes _ntfIconPop { 0%{transform:scale(.4);opacity:0} 60%{transform:scale(1.12);opacity:1} 100%{transform:scale(1)} }
      @keyframes _ntfBar { from{width:100%} to{width:0%} }
      ._ntf-overlay { position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none; }
      ._ntf-box {
        pointer-events:auto;
        min-width:300px;max-width:400px;
        background:#fff;
        border-radius:18px;
        box-shadow:0 16px 48px rgba(0,0,0,.18),0 4px 12px rgba(0,0,0,.08);
        overflow:hidden;
        animation:_ntfIn .42s cubic-bezier(.22,.68,0,1.2) forwards;
        font-family:'Sarabun',sans-serif;
        cursor:pointer;
      }
      ._ntf-inner { position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:32px 26px 26px; }
      ._ntf-icon-wrap {
        width:68px;height:68px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:36px;flex-shrink:0;
        animation:_ntfIconPop .5s cubic-bezier(.34,1.56,.64,1) .05s both;
      }
      ._ntf-text { min-width:0; }
      ._ntf-title { font-size:16px;font-weight:700;color:#1c2333;line-height:1.4; }
      ._ntf-sub   { font-size:12.5px;color:#6b7280;margin-top:4px;line-height:1.5; }
      ._ntf-bar   { height:3px;border-radius:0 0 18px 18px; }
      ._ntf-bar-fill { height:100%;border-radius:0 0 18px 18px;animation:_ntfBar var(--dur,2.5s) linear forwards; }
      ._ntf-close { position:absolute;top:8px;right:8px;flex-shrink:0;width:28px;height:28px;border-radius:50%;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:16px;transition:background .15s; }
      ._ntf-close:hover { background:#f3f4f6;color:#374151; }
    `;
    document.head.appendChild(s);
  }

  // ── classify message ────────────────────────────────────────
  // หมายเหตุ: ทุกประเภทข้อความใช้โทนสีเขียวเหมือนกันหมด (ตามที่ผู้ใช้ต้องการ)
  // ยังคง emoji ต่างกันตามประเภท เพื่อให้พอแยกแยะเนื้อหาได้ แต่สี icon/bar/border เป็นเขียวเสมอ
  let icon='ℹ️';
  const iconBg='#f0fdf4', iconColor='#16a34a', barColor='#22c55e', borderL='#22c55e';
  const m = msg;
  if (m.includes('❌')||m.includes('ผิดพลาด')||m.includes('ไม่สำเร็จ')||m.includes('error')) {
    icon='❌';
  } else if (m.includes('⚠️')||m.includes('แจ้งเตือน')||m.includes('ระวัง')||m.includes('ผิดปกติ')) {
    icon='⚠️';
  } else if (m.includes('🔒')||m.includes('ล็อค')||m.includes('ไม่อนุญาต')) {
    icon='🔒';
  } else if (m.includes('🔄')||m.includes('⏳')||m.includes('กำลัง')||m.includes('sync')) {
    icon='🔄';
  } else if (m.includes('👋')||m.includes('ออกจากระบบ')) {
    icon='👋';
  } else if (m.includes('👁')||m.includes('ผู้เยี่ยมชม')) {
    icon='👁';
  } else if (m.includes('🗑️')||m.includes('ลบ')) {
    icon='🗑️';
  } else if (m.includes('☁')||m.includes('⬇')||m.includes('📋')) {
    icon='☁';
  } else if (m.includes('🖨️')) {
    icon='🖨️';
  } else if (m.includes('🔍')) {
    icon='🔍';
  } else if (m.includes('✅')||m.includes('สำเร็จ')||m.includes('บันทึก')||m.includes('ยินดีต้อนรับ')||m.includes('โหลด')) {
    icon='✅';
  }

  // strip leading emoji for main text
  const cleanText = m.replace(/^\p{Emoji}+\s*/u,'').trim();
  // split first line as title, rest as subtitle
  const lines = cleanText.split(/[·|·]|(?<=\S{6,})\s{2,}/);
  const title = lines[0]?.trim() || cleanText;
  const sub   = lines.slice(1).join(' ').trim();

  // ── build DOM ───────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = '_ntf-overlay';

  const box = document.createElement('div');
  box.className = '_ntf-box';
  box.style.borderTop = '4px solid '+borderL;
  box.innerHTML = `
    <div class="_ntf-inner">
      <button class="_ntf-close" title="ปิด">✕</button>
      <div class="_ntf-icon-wrap" style="background:${iconBg};color:${iconColor}">${icon}</div>
      <div class="_ntf-text">
        <div class="_ntf-title">${title}</div>
        ${sub ? '<div class="_ntf-sub">'+sub+'</div>' : ''}
      </div>
    </div>
    <div class="_ntf-bar"><div class="_ntf-bar-fill" style="background:${barColor};--dur:${dur/1000}s"></div></div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // ── close logic ─────────────────────────────────────────────
  const close = () => {
    box.style.animation = '_ntfOut .3s cubic-bezier(.4,0,1,1) forwards';
    overlay.style.pointerEvents = 'none';
    setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 300);
  };
  box.querySelector('._ntf-close').addEventListener('click', e => { e.stopPropagation(); close(); });
  box.addEventListener('click', close);
  setTimeout(close, dur);
}

function showSavePopup(title, msg) {
  document.getElementById('savePopupTitle').textContent = title || 'บันทึกสำเร็จ!';
  document.getElementById('savePopupMsg').textContent = msg || 'ข้อมูลโครงการได้รับการบันทึกเรียบร้อยแล้ว';
  document.getElementById('savePopupOverlay').classList.add('open');
}
function closeSavePopup() {
  document.getElementById('savePopupOverlay').classList.remove('open');
}

// ===== QUARTER FILTER =====
function getFilteredProjects() {
  if (currentQuarter==='all') return projects;
  return projects.filter(p => p.quarter===currentQuarter || p.quarter==='all');
}

function onQuarterChange() {
  currentQuarter = document.getElementById('quarterSelect').value;
  const qL = Q_LABEL[currentQuarter];
  document.getElementById('quarterLabel').textContent = 'แสดงข้อมูล: '+qL;
  document.getElementById('quarterBadge').textContent = qL;
  document.getElementById('summaryQuarterLabel').textContent = qL+' · ปีงบประมาณ 2569';
  document.querySelector('.sidebar-footer') && (document.querySelector('.sidebar-footer').textContent = qL);
  updateDashboard();
}

// ===== AUTH SYSTEM =====
const AUTH_SESSION_KEY = 'dltv_auth_session_2569';

let _currentUser = null; // null = ยังไม่ login, { id, name, email, isGuest, position, dept } = login แล้ว
// แสดงชื่อ-นามสกุล และตำแหน่งของผู้ใช้ที่ล็อกอินอยู่ ใช้เติมอัตโนมัติในฟอร์ม/ประวัติการแก้ไข
function _editorDisplayName(u) {
  const user = u || _currentUser;
  if (!user || user.isGuest) return '';
  return user.position ? `${user.name} (${user.position})` : (user.name || '');
}

function _getSession() {
  try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null'); } catch(e){ return null; }
}
function _saveSession(user) {
  try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user)); } catch(e){}
}
function _hashSimple(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
  return 'h' + Math.abs(h).toString(16);
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const btn = input.nextElementSibling;
  if (!input || !btn) return;
  
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  }
}

function openAuthModal(tab) {
  switchAuthTab(tab || 'login');
  document.getElementById('authOverlay').classList.add('open');
  setTimeout(() => {
    const m = { login:'loginEmail', register:'fbRegName', forgot:'forgotEmail' };
    const el = document.getElementById(m[tab] || 'loginEmail');
    if (el) el.focus();
  }, 120);
}
function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
}
function switchAuthTab(tab) {
  const tabs = document.getElementById('authTabsBar');
  if (tabs) tabs.style.display = (tab === 'forgot') ? 'none' : '';
  document.getElementById('tabLogin')    && document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister') && document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('authLoginForm').style.display    = tab === 'login'    ? 'flex' : 'none';
  document.getElementById('authRegisterForm').style.display = tab === 'register' ? 'flex' : 'none';
  document.getElementById('authForgotForm').style.display   = tab === 'forgot'   ? 'flex' : 'none';

  // reset forgot steps เสมอเมื่อเปิดหน้า forgot
  if (tab === 'forgot') {
    document.getElementById('forgotStep1').style.display = '';
    document.getElementById('forgotStep2').style.display = 'none';
    const sentStep = document.getElementById('forgotSentStep');
    if (sentStep) sentStep.style.display = 'none';
    document.getElementById('forgotEmail').value = '';
    window._forgotEmail = '';
  }

  ['loginError','forgotError','forgotStep2Error','forgotStep2Success'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
}

// Step 1 — ขอรหัสชั่วคราว
async function authRequestReset() {
  const email = (document.getElementById('forgotEmail').value || '').trim().toLowerCase();
  const errEl = document.getElementById('forgotError');
  const btn   = document.getElementById('forgotSubmitBtn');
  errEl.classList.remove('show');

  if (!email) { errEl.textContent = 'กรุณากรอกอีเมล'; errEl.classList.add('show'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = 'รูปแบบอีเมลไม่ถูกต้อง'; errEl.classList.add('show'); return; }

  btn.disabled = true; btn.textContent = '⏳ กำลังดำเนินการ...';

  // ── 1) Firebase Auth ก่อน ──────────────────────────────────
  // บัญชีส่วนใหญ่ถูกสร้างผ่าน firebase.auth().createUserWithEmailAndPassword
  // (ดู fbRegisterSubmit ท้ายไฟล์) ไม่ใช่ผ่าน GAS Sheet หรือ localStorage
  // เดิม flow นี้ไม่เคยเช็ก Firebase เลย จึงทำให้อีเมลที่สมัครจริงถูกแจ้งว่า
  // "ไม่พบอีเมลนี้ในระบบ" อยู่เสมอ — จึงต้องลอง Firebase ก่อนเป็นอันดับแรก
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      document.getElementById('forgotStep1').style.display = 'none';
      const sentStep = document.getElementById('forgotSentStep');
      if (sentStep) {
        sentStep.style.display = '';
        document.getElementById('forgotSentMsg').innerHTML =
          `ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่<br><strong>${email}</strong> แล้ว<br>
           กรุณาตรวจสอบกล่องข้อความอีเมล (รวมถึงโฟลเดอร์ Junk/Spam) แล้วทำตามลิงก์เพื่อตั้งรหัสผ่านใหม่`;
      }
      btn.disabled = false; btn.textContent = 'ขอรหัสชั่วคราว';
      return;
    } catch (err) {
      // ถ้าไม่พบอีเมลใน Firebase / รูปแบบอีเมลผิด / ไม่มีเน็ต ให้ตกไปลอง GAS/Local ต่อ
      // ข้อผิดพลาดอื่น ๆ (เช่น too-many-requests) แจ้งผู้ใช้ทันทีโดยไม่ fallback
      console.warn('[authRequestReset] Firebase sendPasswordResetEmail failed:', err.code, err.message);
      const fallthroughCodes = ['auth/user-not-found', 'auth/invalid-email', 'auth/network-request-failed'];
      if (err.code && !fallthroughCodes.includes(err.code)) {
        errEl.textContent = err.code === 'auth/too-many-requests'
          ? 'ลองใหม่อีกครั้งในภายหลัง'
          : ('เกิดข้อผิดพลาด: ' + (err.message || err.code));
        errEl.classList.add('show');
        btn.disabled = false; btn.textContent = 'ขอรหัสชั่วคราว';
        return;
      }
      // else: ตกไปลอง GAS/Local ด้านล่าง — ถ้าตกมาถึงจุดนี้ด้วย auth/user-not-found
      // แปลว่าอีเมลนี้ไม่มีอยู่ใน Firebase Auth จริง ๆ (ตรวจสอบได้ที่ Firebase Console
      // > Authentication > Users) ไม่ใช่บั๊กของฝั่งเว็บ
    }
  }

  const _showStep2 = (res) => {
    window._forgotEmail = email;
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = '';
    document.getElementById('forgotStep2Banner').innerHTML =
      `✅ สร้างรหัสชั่วคราวสำหรับ <strong>${email}</strong> แล้ว<br>
       รหัสชั่วคราว: <strong style="font-size:15px;letter-spacing:.05em;color:#92400e">${res.tempPassword}</strong><br>
       <span style="font-size:11px;">กรอกรหัสนี้แล้วตั้งรหัสผ่านใหม่ด้านล่างได้เลย</span>`;
    document.getElementById('forgotStep2Error').classList.remove('show');
    document.getElementById('forgotStep2Success').classList.remove('show');
    document.getElementById('forgotTempPass').value = '';
    document.getElementById('forgotNewPass').value  = '';
    document.getElementById('forgotConfirmPass').value = '';
    setTimeout(()=>{ document.getElementById('forgotTempPass').focus(); }, 120);
  };

  // ── 2) ลอง GAS (สำหรับบัญชีเก่าที่ผูกกับ Google Sheet) ──
  if (_gasReady()) {
    try {
      const res = await _gasAuthCall({ action: 'resetPassword', email });
      if (res.success) { _showStep2(res); btn.disabled = false; btn.textContent = 'ขอรหัสชั่วคราว'; return; }
    } catch(e) { /* ตกไป local */ }
  }

  // ── 3) Fallback สุดท้าย: Local ──
  const localRes = _localResetPassword(email);
  if (localRes.success) {
    _showStep2(localRes);
  } else {
    errEl.textContent = localRes.message || 'ไม่พบอีเมลนี้ในระบบ';
    errEl.classList.add('show');
  }
  btn.disabled = false; btn.textContent = 'ขอรหัสชั่วคราว';
}

// Step 2 — ตั้งรหัสผ่านใหม่
async function authChangePassword() {
  const tempPass    = (document.getElementById('forgotTempPass').value    || '').trim();
  const newPass     = (document.getElementById('forgotNewPass').value     || '');
  const confirmPass = (document.getElementById('forgotConfirmPass').value || '');
  const errEl = document.getElementById('forgotStep2Error');
  const sucEl = document.getElementById('forgotStep2Success');
  const btn   = document.getElementById('changePassBtn');
  errEl.classList.remove('show');
  sucEl.classList.remove('show');

  if (!tempPass)             { errEl.textContent = 'กรุณากรอกรหัสชั่วคราว'; errEl.classList.add('show'); return; }
  if (newPass.length < 6)    { errEl.textContent = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'; errEl.classList.add('show'); return; }
  if (newPass !== confirmPass){ errEl.textContent = 'รหัสผ่านใหม่ไม่ตรงกัน'; errEl.classList.add('show'); return; }

  btn.disabled = true; btn.textContent = '⏳ กำลังบันทึก...';
  const email2 = window._forgotEmail || '';
  const tempHash = _hashSimple(tempPass);
  const newHash  = _hashSimple(newPass);

  const _onSuccess = () => {
    sucEl.textContent = '✅ เปลี่ยนรหัสผ่านสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...';
    sucEl.classList.add('show');
    setTimeout(()=>{ switchAuthTab('login'); document.getElementById('loginEmail').value = email2; window._forgotEmail = ''; }, 1800);
  };

  // ── ลอง GAS ก่อน ──
  if (_gasReady()) {
    try {
      const res = await _gasAuthCall({ action: 'changePassword', email: email2, tempPasswordHash: tempHash, newPasswordHash: newHash });
      if (res.success) { _onSuccess(); btn.disabled = false; btn.textContent = 'ตั้งรหัสผ่านใหม่'; return; }
    } catch(e) { /* ตกไป local */ }
  }

  // ── Fallback: Local ──
  const localRes = _localChangePassword(email2, tempHash, newHash);
  if (localRes.success) {
    _onSuccess();
  } else {
    errEl.textContent = localRes.message || 'รหัสชั่วคราวไม่ถูกต้อง';
    errEl.classList.add('show');
  }
  btn.disabled = false; btn.textContent = 'ตั้งรหัสผ่านใหม่';
}

// กลับ step 1
function authBackToStep1() {
  document.getElementById('forgotStep2').style.display = 'none';
  const sentStep = document.getElementById('forgotSentStep');
  if (sentStep) sentStep.style.display = 'none';
  document.getElementById('forgotStep1').style.display = '';
  document.getElementById('forgotError').classList.remove('show');
  document.getElementById('forgotEmail').value = '';
  window._forgotEmail = '';
  setTimeout(()=>{ document.getElementById('forgotEmail').focus(); }, 80);
}

// ── ตรวจสอบว่า GAS พร้อมหรือยัง ──
function _gasReady() {
  return typeof GAS_ENABLED !== 'undefined' && GAS_ENABLED && _gasUrl && !_gasUrl.includes('YOUR_GAS');
}

// ── เรียก GAS action ผ่าน GET (ใช้ JSONP pattern เพื่อหลีกเลี่ยง CORS) ──
function _gasAuthCall(params) {
  return new Promise((resolve, reject) => {
    const cbName = '_authCb_' + Date.now() + '_' + Math.floor(Math.random()*9999);
    const timeout = setTimeout(() => {
      delete window[cbName];
      if (script.parentNode) script.remove();
      reject(new Error('timeout'));
    }, 15000);

    window[cbName] = function(data) {
      clearTimeout(timeout);
      delete window[cbName];
      if (script.parentNode) script.remove();
      resolve(data);
    };

    const p = new URLSearchParams({ ...params, callback: cbName });
    const script = document.createElement('script');
    script.src = _gasUrl + '?' + p.toString();
    script.onerror = () => {
      clearTimeout(timeout);
      delete window[cbName];
      if (script.parentNode) script.remove();
      reject(new Error('network error'));
    };
    document.head.appendChild(script);
  });
}

// ── Local user storage (fallback เมื่อไม่มี GAS) ──────────────
const LOCAL_USERS_KEY = 'dltv_local_users_2569';
function _localUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]'); } catch(e){ return []; }
}
function _saveLocalUsers(users) {
  try { localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users)); } catch(e){}
}
// อัปเดต local cache หลัง login สำเร็จผ่าน GAS (เพื่อให'อ offline fallback ทำงานได้)
function _localSyncUser(user) {
  try {
    const users = _localUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push({ ...user, createdAt: new Date().toISOString() });
    }
    _saveLocalUsers(users);
  } catch(e) {}
}
function _localLogin(email, passwordHash) {
  const users = _localUsers();
  const u = users.find(u => u.email === email && u.passwordHash === passwordHash);
  if (u) return { success: true, user: { id: u.id, name: u.name, email: u.email, position: u.position||'', dept: u.dept||'' } };
  return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
}
function _localRegister(name, email, passwordHash, position='', dept='') {
  const users = _localUsers();
  if (users.find(u => u.email === email)) return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
  const u = { id: 'u_' + Date.now(), name, email, passwordHash, position, dept, createdAt: new Date().toISOString() };
  users.push(u);
  _saveLocalUsers(users);
  return { success: true, user: { id: u.id, name: u.name, email: u.email, position, dept } };
}
function _localResetPassword(email) {
  const users = _localUsers();
  const u = users.find(u => u.email === email);
  if (!u) return { success: false, message: 'ไม่พบอีเมลนี้ในระบบ' };
  const tmp = 'tmp' + Math.floor(100000 + Math.random() * 900000);
  u.tempPassword = _hashSimple(tmp);
  u.tempPasswordPlain = tmp;
  _saveLocalUsers(users);
  return { success: true, tempPassword: tmp };
}
function _localChangePassword(email, tempHash, newHash) {
  const users = _localUsers();
  const u = users.find(u => u.email === email);
  if (!u) return { success: false, message: 'ไม่พบอีเมล' };
  if (u.tempPassword !== tempHash) return { success: false, message: 'รหัสชั่วคราวไม่ถูกต้อง' };
  u.passwordHash = newHash;
  delete u.tempPassword; delete u.tempPasswordPlain;
  _saveLocalUsers(users);
  return { success: true };
}

// ─── ระบบเข้าสู่ระบบ/สมัครสมาชิก ใช้ชุดใหม่ (Firebase + GAS + Local) ที่ประกาศไว้ด้านล่างไฟล์นี้ (window.authLogin / window.fbRegisterSubmit) ───
function authGuest() {
  _setLoggedIn({ id: 'guest', name: 'ผู้เยี่ยมชม', email: '', isGuest: true });
  closeAuthModal();
  showToast('👁 เข้าสู่โหมดผู้เยี่ยมชม · ดูข้อมูลได้อย่างเดียว', 2500);
}

function authLogout() {
  // Sign out Firebase ด้วยถ้า login ด้วย Firebase
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
    firebase.auth().signOut().catch(() => {});
  }
  _currentUser = null;
  _saveSession(null);
  _applyAuthUI();
  toggleUserMenu(true);
  showToast('👋 ออกจากระบบแล้ว', 2000);
  setTimeout(() => openAuthModal('login'), 500);
}

function _setLoggedIn(user) {
  _currentUser = user;
  _saveSession(user);
  _applyAuthUI();
  // โหลดข้อมูลจาก localStorage ใหม่ทุกครั้งที่ login สำเร็จ
  if (user && !user.isGuest) {
    if (typeof loadFromLocal   === 'function') loadFromLocal();
    if (typeof updateDashboard === 'function') updateDashboard();
    if (typeof renderTable     === 'function') renderTable();
    // sync จาก Sheet หลัง login (safe mode)
    if (typeof window._syncFromSheetSilent === 'function') {
      setTimeout(window._syncFromSheetSilent, 800);
    }
  }
}

function _applyAuthUI() {
  const loggedIn = !!_currentUser && !_currentUser.isGuest;
  const guest    = !!_currentUser && !!_currentUser.isGuest;

  ['topbarAddBtn','tableAddBtn','riskAddBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = loggedIn ? '' : 'none';
  });

  const rb = document.getElementById('readonlyBadge');
  if (rb) rb.style.display = guest ? '' : 'none';

  const lb = document.getElementById('loginBtn');
  if (lb) lb.style.display = _currentUser ? 'none' : '';

  const pw = document.getElementById('userPillWrap');
  if (pw) pw.style.display = _currentUser ? '' : 'none';

  if (_currentUser) {
    const initials   = _currentUser.isGuest ? '👁' : (_currentUser.name||'?').slice(0,1).toUpperCase();
    const avatarEl   = document.getElementById('userAvatar');
    const pillNameEl = document.getElementById('userPillName');
    const menuNameEl = document.getElementById('menuDisplayName');
    const menuEmailEl= document.getElementById('menuEmail');
    if (avatarEl)    avatarEl.textContent    = initials;
    if (pillNameEl)  pillNameEl.textContent  = _currentUser.isGuest ? 'ผู้เยี่ยมชม' : _currentUser.name;
    if (menuNameEl)  menuNameEl.textContent  = _currentUser.name;
    if (menuEmailEl) menuEmailEl.textContent = _currentUser.email || 'ผู้เยี่ยมชม (ไม่มีบัญชี)';
    // แสดง position ใน dropdown ถ้ามี
    const menuPosEl = document.getElementById('menuPosition');
    if (menuPosEl) {
      const pos  = _currentUser.position || '';
      const dept = _currentUser.dept || '';
      menuPosEl.textContent = [pos, dept].filter(Boolean).join(' · ');
      menuPosEl.style.display = (pos||dept) ? 'block' : 'none';
    }
  }

  if (typeof renderTable === 'function') renderTable();
}

function toggleUserMenu(forceClose) {
  const menu = document.getElementById('userMenu');
  if (!menu) return;
  if (forceClose) { menu.classList.remove('open'); return; }
  menu.classList.toggle('open');
}

document.addEventListener('click', e => {
  const pill = document.getElementById('userPillWrap');
  if (pill && !pill.contains(e.target)) {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.remove('open');
  }
});

function _isEditable() {
  return !!_currentUser && !_currentUser.isGuest;
}

// Restore session on load (เก็บแค่ session ไม่ใช่ users)
(function _initAuth(){
  const session = _getSession();
  if (session) _currentUser = session;
})();

// ===== STORAGE =====
function saveToLocal(silent) {
  try { localStorage.setItem('dltv_projects_2569_v2', JSON.stringify(projects)); if(!silent) showToast('💾 บันทึกข้อมูลแล้ว'); } catch(e){}
}
function loadFromLocal() {
  try {
    // ลอง key ใหม่ก่อน
    let d = localStorage.getItem('dltv_projects_2569_v2');
    // fallback key เก่า
    if(!d) d = localStorage.getItem('dltv_projects_2569');
    if(!d) d = localStorage.getItem('projects');
    if(d){
      const p = JSON.parse(d);
      if(Array.isArray(p) && p.length > 0){
        projects = p;
        return true;
      }
    }
  } catch(e){ console.warn('loadFromLocal error:', e); }
  // ไม่มีข้อมูลใน LocalStorage → ใช้ default projects ที่ฝังในโค้ดไว้แล้ว
  return false;
}
function resetToDefault() {
  if(!confirm('ยืนยันการรีเซ็ตข้อมูลทั้งหมดกลับค่าเริ่มต้น?')) return;
  try{localStorage.removeItem('dltv_projects_2569_v2');}catch(e){}
  location.reload();
}

// ===== NAVIGATION =====
function showPage(page, strategyFilter) {
  ['dashboard','projects','gsheet','livetracking','risk'].forEach(p => {
    const el = document.getElementById('page-'+p);
    if (el) el.style.display = p===page?'block':'none';
  });
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  if(event&&event.currentTarget) event.currentTarget.classList.add('active');

  const titles = {
    dashboard:    ['Dashboard สรุปภาพรวม','รายงานผลการดำเนินงานโครงการ ปีงบประมาณ พ.ศ. 2569'],
    projects:     ['รายการโครงการ','โครงการทั้งหมด 4 ยุทธศาสตร์ + งบบริหารสำนักงาน'],
    gsheet:       ['Google Sheets','นำเข้า / ส่งออกข้อมูล'],
    livetracking: ['📡 ประวัติการแก้ไข','ระบบติดตามผลการดำเนินงานแบบเรียลไทม์'],
    risk:         ['🛡️ การบริหารความเสี่ยง','ระบบบันทึกและติดตามความเสี่ยงโครงการ ปีงบประมาณ พ.ศ. 2569']
  };
  document.getElementById('topbar-title').textContent=titles[page][0];
  document.getElementById('topbar-sub').textContent=titles[page][1];

  if(page==='dashboard') updateDashboard();
  if(page==='projects'){
    if(strategyFilter!==undefined) document.getElementById('filterStrategy').value=strategyFilter;
    if(strategyFilter!==undefined){ const fc=document.getElementById('filterCommittee'); if(fc) fc.value=''; }
    currentPage=1; renderTable();
  }
  if(page==='livetracking') renderLiveTracking();
  if(page==='risk') initRiskPage();

  // auto-close mobile sidebar after nav
  if (window.innerWidth <= 640) {
    const sb = document.querySelector('.sidebar');
    const bd = document.getElementById('sidebarBackdrop');
    if (sb) sb.classList.remove('open');
    if (bd) bd.style.display = 'none';
  }
}

// ===== MOBILE SIDEBAR =====
function toggleSidebar() {
  const sb = document.querySelector('.sidebar');
  const bd = document.getElementById('sidebarBackdrop');
  const open = sb.classList.toggle('open');
  bd.style.display = open ? 'block' : 'none';
}

// ===== ACCESSIBILITY: font scaling + high contrast =====
const FONT_SCALE_KEY = 'dltv_font_scale';
const HIGH_CONTRAST_KEY = 'dltv_high_contrast';
const FONT_SCALE_MIN = 80;
const FONT_SCALE_MAX = 200;
function getFontScale() {
  const v = parseInt(localStorage.getItem(FONT_SCALE_KEY) || '100', 10);
  return isNaN(v) ? 100 : v;
}
function applyFontScale(pct) {
  pct = Math.max(FONT_SCALE_MIN, Math.min(FONT_SCALE_MAX, pct));
  document.documentElement.style.setProperty('--font-scale', pct + '%');
  const lbl = document.getElementById('fontScaleLabel');
  if (lbl) lbl.textContent = pct + '%';
  try { localStorage.setItem(FONT_SCALE_KEY, String(pct)); } catch(e){}
}
function changeFontScale(delta) {
  applyFontScale(getFontScale() + delta);
}
function resetFontScale() {
  applyFontScale(100);
}
function toggleHighContrast() {
  const on = document.body.classList.toggle('high-contrast');
  try { localStorage.setItem(HIGH_CONTRAST_KEY, on ? '1' : '0'); } catch(e){}
  const btn = document.getElementById('hcBtn');
  if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}
// Apply saved a11y prefs immediately on script load
(function initA11y(){
  applyFontScale(getFontScale());
  if (localStorage.getItem(HIGH_CONTRAST_KEY) === '1') {
    document.body && document.body.classList.add('high-contrast');
    const btn = document.getElementById('hcBtn');
    if (btn) btn.setAttribute('aria-pressed', 'true');
  }
})();

// ===== LIVE TRACKING =====
const LT_INTERVAL_MS = 30000;
const LT_FEED_KEY = 'dltv_lt_feed';
const LT_SNAPSHOT_KEY = 'dltv_lt_snapshot';
const LT_FEED_MAX = 50;
let _ltTimer = null;
let _ltAuto  = true;

function _ltLoadFeed() {
  try { return JSON.parse(localStorage.getItem(LT_FEED_KEY) || '[]'); } catch(e){ return []; }
}
function _ltSaveFeed(feed) {
  try { localStorage.setItem(LT_FEED_KEY, JSON.stringify(feed.slice(0, LT_FEED_MAX))); } catch(e){}
}
function _ltLoadSnapshot() {
  try { return JSON.parse(localStorage.getItem(LT_SNAPSHOT_KEY) || 'null'); } catch(e){ return null; }
}
function _ltSaveSnapshot(snap) {
  try { localStorage.setItem(LT_SNAPSHOT_KEY, JSON.stringify(snap)); } catch(e){}
}
function _ltProjectFingerprint(p) {
  return {
    id: p.id, name: p.name, status: p.status,
    budget: p.budget||0, spent: p.spent||0, po: p.po||0,
    result: p.result||'', problems: p.problems||'', solutions: p.solutions||'',
    owner: p.owner||'', quarter: p.quarter||'',
    lastEditedBy: p.lastEditedBy||'', lastEditedByPosition: p.lastEditedByPosition||'', lastEditedAt: p.lastEditedAt||''
  };
}
function _ltDiff(prev, curr) {
  const events = [];
  const prevMap = {};
  (prev||[]).forEach(p => prevMap[p.id] = p);
  const currMap = {};
  (curr||[]).forEach(p => currMap[p.id] = p);

  const _actorName = (f) => (f && f.lastEditedBy) ? f.lastEditedBy : ((_currentUser && !_currentUser.isGuest) ? (_currentUser.name || _currentUser.email || 'ผู้ใช้') : null);
  const _actorPosition = (f) => (f && f.lastEditedByPosition) ? f.lastEditedByPosition : ((_currentUser && !_currentUser.isGuest) ? (_currentUser.position || '') : '');
  (curr||[]).forEach(p => {
    const before = prevMap[p.id];
    const f = _ltProjectFingerprint(p);
    if (!before) {
      events.push({ type:'created', id:p.id, name:p.name, status:p.status, ts:Date.now(), change:'โครงการใหม่', user:_actorName(f), userPosition:_actorPosition(f) });
      return;
    }
    const changes = [];
    if (before.status !== f.status) changes.push({ field:'สถานะ', from:_statusLabel(before.status), to:_statusLabel(f.status) });
    if (before.budget !== f.budget) changes.push({ field:'งบประมาณ', from:_money(before.budget), to:_money(f.budget) });
    if (before.spent !== f.spent)   changes.push({ field:'ใช้จ่าย', from:_money(before.spent), to:_money(f.spent) });
    if (before.po !== f.po)         changes.push({ field:'PO', from:_money(before.po), to:_money(f.po) });
    if (before.result !== f.result) changes.push({ field:'ผลการดำเนินงาน', from:'', to:f.result ? '(อัปเดต)' : '(ลบ)' });
    if (before.problems !== f.problems) changes.push({ field:'ปัญหา', from:'', to:'(อัปเดต)' });
    if (before.solutions !== f.solutions) changes.push({ field:'แนวทางแก้ไข', from:'', to:'(อัปเดต)' });
    if (before.owner !== f.owner)   changes.push({ field:'ผู้รับผิดชอบ', from:before.owner||'-', to:f.owner||'-' });
    if (changes.length) {
      events.push({ type:'updated', id:p.id, name:p.name, status:p.status, ts:Date.now(), changes, user:_actorName(f), userPosition:_actorPosition(f) });
    }
  });
  (prev||[]).forEach(p => {
    if (!currMap[p.id]) {
      events.push({ type:'deleted', id:p.id, name:p.name, ts:Date.now(), change:'ถูกลบ', user:_actorName(null), userPosition:_actorPosition(null) });
    }
  });
  return events;
}
function _statusLabel(s) {
  return s==='done'?'เสร็จสิ้น': s==='progress'?'กำลังดำเนินการ': s==='pending'?'ยังไม่เริ่ม': s||'-';
}
function _money(n) {
  return (Number(n)||0).toLocaleString('th-TH') + ' ฿';
}
function _timeAgo(ts) {
  const s = Math.max(0, Math.floor((Date.now()-ts)/1000));
  if (s < 60) return s + ' วินาทีที่แล้ว';
  if (s < 3600) return Math.floor(s/60) + ' นาทีที่แล้ว';
  if (s < 86400) return Math.floor(s/3600) + ' ชั่วโมงที่แล้ว';
  return Math.floor(s/86400) + ' วันที่แล้ว';
}

function renderLiveTracking() {
  if (!Array.isArray(projects)) return;
  // Stats
  const done = projects.filter(p=>p.status==='done').length;
  const prog = projects.filter(p=>p.status==='progress').length;
  const pend = projects.filter(p=>p.status==='pending').length;
  const tot  = projects.length;

  const snap = _ltLoadSnapshot();
  const prevDone = snap ? snap.filter(p=>p.status==='done').length : done;
  const prevProg = snap ? snap.filter(p=>p.status==='progress').length : prog;
  const prevPend = snap ? snap.filter(p=>p.status==='pending').length : pend;
  const prevTot  = snap ? snap.length : tot;

  const set = (id, v, delta) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
    const dEl = document.getElementById(id+'Delta');
    if (dEl) {
      const sign = delta>0?'+':(delta<0?'':'±');
      dEl.textContent = sign + delta;
      dEl.className = 'lt-stat-delta ' + (delta>0?'up':(delta<0?'down':'zero'));
    }
  };
  set('ltStatTotal',   tot,  tot  - prevTot);
  set('ltStatDone',    done, done - prevDone);
  set('ltStatProgress',prog, prog - prevProg);
  set('ltStatPending', pend, pend - prevPend);

  // Feed
  const feed = _ltLoadFeed();
  const list = document.getElementById('ltFeedList');
  if (!list) return;
  if (!feed.length) {
    list.innerHTML = '<div class="lt-empty">⏳ ยังไม่มีความเคลื่อนไหว · ระบบจะแสดงการเปลี่ยนแปลงทันทีเมื่อมีข้อมูลใหม่จาก Google Sheet</div>';
    return;
  }
  list.innerHTML = feed.map(ev => {
    const icon = ev.type==='created' ? '✨' : ev.type==='deleted' ? '🗑️' : ev.status==='done' ? '✅' : ev.status==='progress' ? '⏳' : '📝';
    let change = '';
    if (ev.type==='created' || ev.type==='deleted') {
      change = ev.change;
    } else if (ev.changes) {
      change = ev.changes.map(c => `<b>${c.field}</b>: ${c.from} → ${c.to}`).join(' · ');
    }
    const userTag = ev.user ? `<span style="display:inline-flex;align-items:center;gap:3px;background:rgba(59,114,240,.12);color:var(--accent);font-size:11px;font-weight:700;padding:1px 7px;border-radius:99px;margin-top:3px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>${_esc(ev.user)}${ev.userPosition?' · '+_esc(ev.userPosition):''}</span>` : '';
    return `<div class="lt-feed-item ${ev.type==='created'?'created':ev.type==='deleted'?'deleted':'status-'+ev.status}">
      <div class="lt-feed-icon">${icon}</div>
      <div class="lt-feed-body">
        <div class="lt-feed-name">${_esc(ev.name||'(ไม่ระบุชื่อ)')}</div>
        <div class="lt-feed-change">${change}</div>
        ${userTag}
      </div>
      <div class="lt-feed-time">${_timeAgo(ev.ts)}</div>
    </div>`;
  }).join('');

  const lastEl = document.getElementById('ltLastSync');
  if (lastEl) lastEl.textContent = new Date().toLocaleTimeString('th-TH');
  const srcEl = document.getElementById('ltDataSource');
  if (srcEl) srcEl.textContent = (typeof GAS_ENABLED!=='undefined' && GAS_ENABLED && _gasUrl && !_gasUrl.includes('YOUR_GAS')) ? 'Google Sheet' : 'Local Storage';
}
function _esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function _ltRecord(events) {
  if (!events || !events.length) return;
  const feed = _ltLoadFeed();
  events.forEach(e => feed.unshift(e));
  _ltSaveFeed(feed);
}

// Called after every sync/update to detect changes
function ltCaptureSnapshot() {
  const curr = (projects||[]).map(_ltProjectFingerprint);
  const prev = _ltLoadSnapshot();
  if (prev) {
    const events = _ltDiff(prev, curr);
    _ltRecord(events);
  }
  _ltSaveSnapshot(curr);
}

function toggleLiveAutoRefresh() {
  _ltAuto = document.getElementById('ltAutoChk').checked;
  const st = document.getElementById('ltLiveStatus');
  if (st) st.textContent = _ltAuto ? 'อัปเดตอัตโนมัติ' : 'หยุดชั่วคราว';
  if (_ltAuto) _ltStartTimer();
  else _ltStopTimer();
}
function _ltStartTimer() {
  _ltStopTimer();
  _ltTimer = setInterval(() => {
    if (typeof window._syncFromSheetSilent === 'function') {
      window._syncFromSheetSilent().then(() => {
        ltCaptureSnapshot();
        if (document.getElementById('page-livetracking').style.display !== 'none') {
          renderLiveTracking();
        }
      });
    } else {
      ltCaptureSnapshot();
      if (document.getElementById('page-livetracking').style.display !== 'none') {
        renderLiveTracking();
      }
    }
  }, LT_INTERVAL_MS);
}
function _ltStopTimer() {
  if (_ltTimer) { clearInterval(_ltTimer); _ltTimer = null; }
}
function forceLiveSync() {
  const st = document.getElementById('ltLiveStatus');
  if (st) st.textContent = 'กำลังโหลด...';
  const after = () => {
    ltCaptureSnapshot();
    renderLiveTracking();
    if (st) st.textContent = _ltAuto ? 'อัปเดตอัตโนมัติ' : 'หยุดชั่วคราว';
  };
  if (typeof window._syncFromSheetSilent === 'function') {
    window._syncFromSheetSilent().then(after).catch(after);
  } else {
    after();
  }
}

// Start live tracking timer once on script load
setTimeout(() => {
  // initial snapshot if none
  if (!_ltLoadSnapshot()) _ltSaveSnapshot((projects||[]).map(_ltProjectFingerprint));
  _ltStartTimer();
  const st = document.getElementById('ltLiveStatus');
  if (st) st.textContent = 'อัปเดตอัตโนมัติ';
}, 1500);

function filterByStatus(status) {
  document.getElementById('filterStatus').value=status;
  renderTable();
}

function goToStrategy(s) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    if(el.getAttribute('onclick') && el.getAttribute('onclick').includes("'projects'")) el.classList.add('active');
  });
  showPage('projects', s);
}

// ===== DASHBOARD =====
function updateDashboard() {
  const fp = getFilteredProjects();
  const done = fp.filter(p=>p.status==='done').length;
  const prog = fp.filter(p=>p.status==='progress').length;
  const pend = fp.filter(p=>p.status==='pending').length;
  const tb   = fp.reduce((s,p)=>s+(p.budget||0),0);
  const totalSpent  = fp.reduce((s,p)=>s+(p.spent||0),0);
  const totalPo     = fp.reduce((s,p)=>s+(p.po||0),0);
  const totalPlan   = totalSpent + totalPo;
  const totalRemaining = tb - totalSpent - totalPo;
  const spentPct = tb>0?Math.round(totalSpent/tb*100):0;
  const planPct  = tb>0?Math.round(totalPlan/tb*100):0;
  const remPct   = tb>0?Math.round((tb-totalSpent)/tb*100):100;

  document.getElementById('m-total').textContent = fp.length;
  document.getElementById('m-total-sub').textContent = `4 ยุทธศาสตร์ + งบสำนักงาน`;
  document.getElementById('m-budget').textContent = fmt(tb);
  document.getElementById('m-spent').textContent  = fmt(totalSpent);
  document.getElementById('m-spent-sub').textContent = `คิดเป็น ${spentPct}% ของงบรวม`;
  document.getElementById('m-spent-bar').style.width = Math.min(spentPct,100)+'%';
  document.getElementById('m-remaining').textContent = fmt(tb-totalSpent);
  document.getElementById('m-remaining-sub').textContent = `คิดเป็น ${remPct}% ของงบรวม`;
  document.getElementById('m-remaining-bar').style.width = Math.min(remPct,100)+'%';
  document.getElementById('m-plan').textContent = fmt(totalPlan);
  document.getElementById('m-plan-sub').textContent = `คิดเป็น ${planPct}% ของงบรวม`;
  document.getElementById('m-plan-bar').style.width = Math.min(planPct,100)+'%';
  document.getElementById('m-po').textContent = fmt(totalPo);
  document.getElementById('m-net-remaining').textContent = fmt(totalRemaining);

  document.getElementById('p-done').textContent = done;
  document.getElementById('p-progress').textContent = prog;
  document.getElementById('p-pending').textContent = pend;

  renderBudgetBar(fp, tb, totalSpent, totalPo, totalRemaining);
  renderStrategyCards(fp);
  renderSummaryTable(fp);
  renderCommitteeSection(fp);
  requestAnimationFrame(()=>{ renderCharts(fp); renderUtilizationChart(fp); renderCommitteeChart(fp); });
}

function renderBudgetBar(fp, tb, ts, tp, rem) {
  const bar = document.getElementById('budgetMegaBar');
  const leg = document.getElementById('budgetBarLegend');
  const qEl = document.getElementById('budgetBarQuarter');
  if(qEl) qEl.textContent = Q_LABEL[currentQuarter];
  if(!bar) return;
  const spentPct  = tb>0 ? Math.max((ts/tb)*100, 0) : 0;
  const poPct     = tb>0 ? Math.max((tp/tb)*100, 0) : 0;
  const remPct    = tb>0 ? Math.max((Math.max(rem,0)/tb)*100, 0) : 100;
  bar.innerHTML = `
    <div style="width:${spentPct.toFixed(1)}%;background:linear-gradient(90deg,#059669,#34c179);transition:width .6s;min-width:${spentPct>0?2:0}px" title="ใช้ไปแล้ว ${spentPct.toFixed(1)}%"></div>
    <div style="width:${poPct.toFixed(1)}%;background:linear-gradient(90deg,#d97706,#f59e0b);transition:width .6s;min-width:${poPct>0?2:0}px" title="PO ผูกพัน ${poPct.toFixed(1)}%"></div>
    <div style="flex:1;background:var(--surface2)"></div>
  `;
  const usedTotal = ts + tp;
  const usedPct = tb>0?((usedTotal/tb)*100).toFixed(1):0;
  leg.innerHTML = `
    <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:linear-gradient(90deg,#059669,#34c179);display:inline-block"></span>ใช้ไปแล้ว <strong>${fmtFull(ts)} บาท</strong> (${spentPct.toFixed(1)}%)</span>
    <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:linear-gradient(90deg,#d97706,#f59e0b);display:inline-block"></span>PO ผูกพัน <strong>${fmtFull(tp)} บาท</strong> (${poPct.toFixed(1)}%)</span>
    <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:var(--surface2);border:1px solid var(--border2);display:inline-block"></span>คงเหลือ <strong style="color:${rem<0?'var(--red)':'var(--text)'}">${fmtFull(rem)} บาท</strong> (${remPct.toFixed(1)}%)</span>
    <span style="margin-left:auto;font-weight:700;color:var(--accent)">รวมเบิกจ่าย+PO: ${usedPct}% จากงบ ${fmtFull(tb)} บาท</span>
  `;
}

function renderStrategyCards(fp) {
  const el = document.getElementById('strategy-summary');
  el.innerHTML = [1,2,3,4,5].map(s => {
    const ps = fp.filter(p=>p.strategy==s);
    const budget = ps.reduce((a,p)=>a+(p.budget||0),0);
    const spent  = ps.reduce((a,p)=>a+(p.spent||0),0);
    const po     = ps.reduce((a,p)=>a+(p.po||0),0);
    const remaining = budget - spent - po;
    const pct = budget>0?Math.round((spent+po)/budget*100):0;
    const done = ps.filter(p=>p.status==='done').length;
    const prog = ps.filter(p=>p.status==='progress').length;
    const pend = ps.filter(p=>p.status==='pending').length;
    const barColor = pct>=90?'var(--red)': pct>=70?'var(--amber)': S_COLORS[s];
    const isOffice = s === 5;
    const divider = isOffice ? `<div style="border-top:1.5px dashed var(--border2);margin:4px 0 4px;opacity:.7"></div>` : '';
    const cardStyle = isOffice ? 'background:linear-gradient(135deg,var(--s5-light),#e0f7fa);border-color:#7ed9e8;' : '';
    return `${divider}<div class="strategy-card" onclick="goToStrategy('${s}')" title="คลิกเพื่อดูโครงการ${isOffice?'งบบริหารสำนักงาน':'ในยุทธศาสตร์นี้'}" style="${cardStyle}">
      <div class="strategy-card-left">
        <div class="strategy-card-name"><span class="badge ${S_BADGE[s]}">${S_NAMES[s]}</span> <span style="font-weight:500;font-size:12px;color:var(--text2)">${S_FULL[s]}</span>${isOffice?` <span style="font-size:10px;background:var(--s5-light);color:var(--s5);padding:1px 7px;border-radius:99px;font-weight:700;margin-left:4px">ไม่นับรวมยุทธศาสตร์</span>`:''}</div>
        <div class="strategy-card-sub">${ps.length} โครงการ · งบอนุมัติ <strong>${fmt(budget)}</strong> บาท · คงเหลือ <strong style="color:${remaining<0?'var(--red)':'var(--green)'}">${fmt(remaining)}</strong> บาท</div>
        <div class="strategy-progress-wrap">
          <div class="progress-track"><div class="progress-fill" style="width:${Math.min(Math.max(pct,.5),100)}%;background:${barColor};transition:width .5s"></div></div>
          <div class="strategy-stats">
            <span style="color:var(--green)">✅ ${done} แล้วเสร็จ</span>
            <span style="color:var(--accent)">⏳ ${prog} กำลังดำเนิน</span>
            <span style="color:var(--text3)">⭕ ${pend} ยังไม่เริ่ม</span>
            <span style="color:var(--text2)">ใช้+PO: ${fmtFull(spent+po)} บาท</span>
          </div>
        </div>
      </div>
      <div class="strategy-card-right" style="display:flex;align-items:center;gap:10px">
        <div>
          <div class="strategy-pct" style="color:${barColor}">${pct}%</div>
          <div class="strategy-budget-txt">เบิกจ่าย+PO</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${barColor}" stroke-width="2.5" style="opacity:.6;flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>`;
  }).join('');
}

function renderCharts(fp) {
  const budgets = S_KEYS.map(s=>fp.filter(p=>p.strategy==s).reduce((a,p)=>a+(p.budget||0),0));
  const colors  = S_KEYS.map(s=>S_COLORS[s]);
  const chartFont = { family: "'Sarabun', sans-serif", size: 11 };
  const tb = fp.reduce((a,p)=>a+(p.budget||0),0);

  // helper: safely get a fresh canvas by replacing it
  function freshCanvas(id) {
    const old = document.getElementById(id);
    if(!old) return null;
    const parent = old.parentNode;
    const clone = document.createElement('canvas');
    clone.id = id;
    parent.replaceChild(clone, old);
    return clone;
  }

  // ── Doughnut: Budget by strategy ──
  chartBudget = new Chart(freshCanvas('chartBudget'),{
    type:'doughnut',
    data:{
      labels: S_KEYS.map(s=>S_NAMES[s]),
      datasets:[{
        data: budgets, backgroundColor: colors,
        borderWidth: 4, borderColor:'#fff',
        hoverOffset: 10, hoverBorderWidth: 0
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      cutout:'70%',
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(28,35,51,.92)', padding:10, cornerRadius:8,
          callbacks:{ label:ctx=>`  ${fmt(ctx.parsed)} บาท  (${tb>0?Math.round(ctx.parsed/tb*100):0}%)` },
          bodyFont:chartFont, titleFont:{...chartFont,weight:'700'}
        }
      },
      animation:{ animateRotate:true, duration:700 }
    }
  });
  const centerEl = document.getElementById('chartBudgetCenter');
  if(centerEl) centerEl.innerHTML = `<div style="font-size:10px;color:var(--text3);font-weight:600">งบรวม</div><div style="font-size:15px;font-weight:800;color:var(--text);margin-top:1px">${fmt(tb)}</div><div style="font-size:9px;color:var(--text3)">บาท</div>`;

  const leg = document.getElementById('chartBudgetLegend');
  if(leg) leg.innerHTML = S_KEYS.map((s,i)=>`
    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="width:8px;height:8px;border-radius:50%;background:${colors[i]};flex-shrink:0;display:inline-block"></span>
        <span style="font-size:12px;color:var(--text2)">${S_NAMES[s]}</span>
      </div>
      <span style="font-weight:700;color:var(--text);font-size:14px">${fmt(budgets[i])}</span>
    </div>`).join('');

  // ── Bar: Project status ──
  const done=fp.filter(p=>p.status==='done').length;
  const prog=fp.filter(p=>p.status==='progress').length;
  const pend=fp.filter(p=>p.status==='pending').length;

  chartStatus = new Chart(freshCanvas('chartStatus'),{
    type:'bar',
    data:{
      labels:['แล้วเสร็จ','กำลังดำเนิน','ยังไม่เริ่ม'],
      datasets:[{
        data:[done,prog,pend],
        backgroundColor:['rgba(132,177,121,.8)','rgba(229,186,65,.8)','rgba(255,147,126,.8)'],
        borderColor:['#A2CB8B','#F08787','#6D94C5'],
        borderWidth:0, borderRadius:10, borderSkipped:false,
        hoverBackgroundColor:['rgba(26,154,92,0.3)','rgba(59,114,240,0.3)','rgba(154,163,178,0.3)']
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(28,35,51,.92)', padding:10, cornerRadius:8,
          callbacks:{ label:ctx=>`  ${ctx.parsed.y} โครงการ` },
          bodyFont:chartFont, titleFont:{...chartFont,weight:'700'}
        }
      },
      scales:{
        x:{ grid:{display:false}, ticks:{font:chartFont,color:'#5a6477'}, border:{display:false} },
        y:{ beginAtZero:true, ticks:{stepSize:1,font:chartFont,color:'#9aa3b2'}, grid:{color:'rgba(0,0,0,.04)'}, border:{display:false} }
      },
      animation:{ duration:600 }
    }
  });
  const sLeg = document.getElementById('statusLegend');
  if(sLeg) sLeg.innerHTML = [
    ['#A2CB8B','✅ แล้วเสร็จ',done],
    ['#E9B63B','⏳ กำลังดำเนิน',prog],
    ['#B77466','⭕ ยังไม่เริ่ม',pend]
  ].map(([c,l,n])=>`<span style="display:flex;align-items:center;gap:4px;font-size:14px;font-weight:600;color:${c}"><span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span>${l} <strong>${n}</strong></span>`).join('');

  // ── Doughnut: Budget plan vs remaining (gauge) ──
  const ts = fp.reduce((a,p)=>a+(p.spent||0),0);
  const tp = fp.reduce((a,p)=>a+(p.po||0),0);
  const rem = tb - ts - tp;

  chartBudgetGauge = new Chart(freshCanvas('chartBudgetGauge'),{
    type:'doughnut',
    data:{
      labels:['ใช้ไปแล้ว','PO ผูกพัน','คงเหลือ'],
      datasets:[{
        data:[ts, tp, Math.max(rem, 0)],
        backgroundColor:['rgba(240,135,135,.8)','rgba(222,195,132,.8)','rgba(162,203,139,.8)'],
        borderColor:['#F08787','#DEC384','#A2CB8B'],
        borderWidth:0, hoverOffset:8, hoverBorderWidth:0
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      cutout:'70%',
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(28,35,51,.92)', padding:10, cornerRadius:8,
          callbacks:{ label:ctx=>`  ${fmtFull(ctx.parsed)} บาท` },
          bodyFont:chartFont, titleFont:{...chartFont,weight:'700'}
        }
      },
      animation:{ animateRotate:true, duration:700 }
    }
  });
  const usedPct = tb>0?Math.round((ts+tp)/tb*100):0;
  const gCenter = document.getElementById('chartGaugeCenter');
  if(gCenter) gCenter.innerHTML = `<div style="font-size:14px;color:var(--text3);font-weight:600">เบิกจ่าย+PO</div><div style="font-size:18px;font-weight:800;color:var(--accent);margin-top:1px">${usedPct}%</div><div style="font-size:9px;color:var(--text3)">ของงบรวม</div>`;
  const gLeg = document.getElementById('gaugeLegend');
  if(gLeg) gLeg.innerHTML = [
    ['#F08787','ใช้ไปแล้ว',ts],
    ['#DEC384','PO ผูกพัน',tp],
    ['#A2CB8B','คงเหลือสุทธิ',rem]
  ].map(([c,l,n])=>`<div style="display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0;display:inline-block"></span><span style="color:var(--text2)">${l}</span></div><span style="font-weight:700;color:${n<0?'var(--red)':'var(--text)'}">${fmtFull(n)} บาท</span></div>`).join('');
}

function totalBudget(fp){ return fp.reduce((a,p)=>a+(p.budget||0),0); }

function renderUtilizationChart(fp) {
  // แสดงเฉพาะ 4 ยุทธศาสตร์ในแผนภูมิ (strategy 5 = งบบริหารสำนักงาน แสดงแยก)
  const chartKeys = [1,2,3,4,5];
  const labels    = chartKeys.map(s => s===5 ? 'งบสำนักงาน' : S_NAMES[s].replace('ยุทธศาสตร์ที่ ','ย.'));
  const budgets   = chartKeys.map(s=>fp.filter(p=>p.strategy==s).reduce((a,p)=>a+(p.budget||0),0));
  const spents    = chartKeys.map(s=>fp.filter(p=>p.strategy==s).reduce((a,p)=>a+(p.spent||0),0));
  const pos       = chartKeys.map(s=>fp.filter(p=>p.strategy==s).reduce((a,p)=>a+(p.po||0),0));
  const remainings= chartKeys.map((s,i)=>Math.max(budgets[i]-spents[i]-pos[i],0));
  const spentPOs  = chartKeys.map((s,i)=>spents[i]+pos[i]);
  const chartFont = { family:"'Sarabun', sans-serif", size:11 };

  const old = document.getElementById('chartUtilization');
  if(old) { const clone=document.createElement('canvas'); clone.id='chartUtilization'; old.parentNode.replaceChild(clone,old); }

  chartUtilization = new Chart(document.getElementById('chartUtilization'),{
    type:'bar',
    data:{
      labels,
      datasets:[
        { label:'งบอนุมัติ',     data:budgets,   backgroundColor:'rgba(109,148,197,.8)', borderColor:'#6D94C5', borderWidth:0, borderRadius:8, borderSkipped:false },
        { label:'ใช้ไปแล้ว+PO', data:spentPOs,  backgroundColor:'rgba(240,135,135,.8)', borderColor:'#F08787', borderWidth:0, borderRadius:8, borderSkipped:false },
        { label:'PO ผูกพัน',    data:pos,        backgroundColor:'rgba(222,195,132,.8)', borderColor:'#DEC384', borderWidth:0, borderRadius:8, borderSkipped:false },
        { label:'คงเหลือ',      data:remainings, backgroundColor:'rgba(162,203,139,.8)', borderColor:'#A2CB8B', borderWidth:0, borderRadius:8, borderSkipped:false }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ position:'bottom', labels:{ font:chartFont, boxWidth:10, padding:16, usePointStyle:true, pointStyle:'circle' } },
        tooltip:{
          backgroundColor:'rgba(28,35,51,.92)', padding:10, cornerRadius:8,
          callbacks:{
            label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('th-TH')} บาท`,
            afterBody:ctx=>{
              const i=ctx[0]?.dataIndex; if(i===undefined) return;
              const pct=budgets[i]>0?Math.round(spentPOs[i]/budgets[i]*100):0;
              return [`  เบิกจ่าย+PO: ${pct}% ของงบอนุมัติ`];
            }
          },
          bodyFont:chartFont, titleFont:{...chartFont,weight:'700'}
        }
      },
      scales:{
        x:{ grid:{display:false}, ticks:{font:chartFont,color:'#5a6477'}, border:{display:false} },
        y:{ beginAtZero:true, grid:{color:'rgba(0,0,0,.04)'}, border:{display:false},
            ticks:{ callback:v=>v>=1000000?(v/1000000).toFixed(1)+'M':v>=1000?(v/1000).toFixed(0)+'K':v, font:chartFont, color:'#9aa3b2' } }
      },
      animation:{ duration:600 }
    },
    plugins:[{
      id:'strategyDividers',
      afterDraw(chart){
        const {ctx, chartArea:{top,bottom}, scales:{x}} = chart;
        ctx.save();
        for(let i=0; i<labels.length-1; i++){
          const xPos = (x.getPixelForValue(i) + x.getPixelForValue(i+1)) / 2;
          ctx.beginPath();
          ctx.moveTo(xPos, top - 8);
          ctx.lineTo(xPos, bottom);
          ctx.setLineDash([5,4]);
          ctx.strokeStyle = 'rgba(90,100,120,0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }
    }]
  });
}

function renderSummaryTable(fp) {
  const el = document.getElementById('summaryTableBody'); if(!el) return;
  // แสดงเฉพาะ 4 ยุทธศาสตร์ (1-4) ไม่รวมงบบริหารสำนักงาน (5)
  const strategyKeys = [1,2,3,4];
  const strategyProjects = fp.filter(p => strategyKeys.includes(Number(p.strategy)));
  const officeProjects   = fp.filter(p => Number(p.strategy) === 5);

  const makeRow = (s, ps, isOffice) => {
    const budget = ps.reduce((a,p)=>a+(p.budget||0),0);
    const spent  = ps.reduce((a,p)=>a+(p.spent||0),0);
    const po     = ps.reduce((a,p)=>a+(p.po||0),0);
    const remaining = budget-spent-po;
    const pct = budget>0?Math.round((spent+po)/budget*100):0;
    const done=ps.filter(p=>p.status==='done').length;
    const prog=ps.filter(p=>p.status==='progress').length;
    const pend=ps.filter(p=>p.status==='pending').length;
    const rowStyle = isOffice ? 'background:var(--s5-light);border-top:2px solid var(--border2)' : '';
    return `<tr style="${rowStyle}">
      <td><span class="badge ${S_BADGE[s]}">${S_NAMES[s]}</span><div style="font-size:11px;color:var(--text3);margin-top:2px">${S_FULL[s]}</div></td>
      <td style="text-align:center">${ps.length}</td>
      <td class="td-num">${fmtFull(budget)}</td>
      <td class="td-num">${fmtFull(spent)}</td>
      <td class="td-num">${fmtFull(po)}</td>
      <td class="td-num" style="${remaining<0?'color:var(--red)':''}">${fmtFull(remaining)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:7px">
          <div style="flex:1;height:5px;background:var(--surface2);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${Math.min(pct,100)}%;background:${S_COLORS[s]};border-radius:99px"></div>
          </div>
          <span style="font-size:11px;color:var(--text2);min-width:30px;text-align:right">${pct}%</span>
        </div>
      </td>
      <td style="text-align:center;font-size:12px">
        <span style="color:var(--green);margin-right:4px">✅${done}</span>
        <span style="color:var(--accent);margin-right:4px">⏳${prog}</span>
        <span style="color:var(--text3)">○${pend}</span>
      </td>
    </tr>`;
  };

  const rows = strategyKeys.map(s => makeRow(s, fp.filter(p=>p.strategy==s), false));

  // แถวรวม 4 ยุทธศาสตร์
  const sBudget = strategyProjects.reduce((a,p)=>a+(p.budget||0),0);
  const sSpent  = strategyProjects.reduce((a,p)=>a+(p.spent||0),0);
  const sPo     = strategyProjects.reduce((a,p)=>a+(p.po||0),0);
  const sRem    = sBudget-sSpent-sPo;
  const sPct    = sBudget>0?Math.round((sSpent+sPo)/sBudget*100):0;
  rows.push(`<tr style="background:var(--surface2);font-weight:700;border-top:2px solid var(--border2)">
    <td>รวม 4 ยุทธศาสตร์</td>
    <td style="text-align:center">${strategyProjects.length}</td>
    <td class="td-num">${fmtFull(sBudget)}</td>
    <td class="td-num">${fmtFull(sSpent)}</td>
    <td class="td-num">${fmtFull(sPo)}</td>
    <td class="td-num" style="${sRem<0?'color:var(--red)':''}">${fmtFull(sRem)}</td>
    <td>
      <div style="display:flex;align-items:center;gap:7px">
        <div style="flex:1;height:5px;background:var(--border2);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.min(sPct,100)}%;background:var(--accent);border-radius:99px"></div>
        </div>
        <span style="font-size:11px;color:var(--text2);min-width:30px;text-align:right">${sPct}%</span>
      </div>
    </td>
    <td style="text-align:center;font-size:12px">
      <span style="color:var(--green);margin-right:4px">✅${strategyProjects.filter(p=>p.status==='done').length}</span>
      <span style="color:var(--accent);margin-right:4px">⏳${strategyProjects.filter(p=>p.status==='progress').length}</span>
      <span style="color:var(--text3)">○${strategyProjects.filter(p=>p.status==='pending').length}</span>
    </td>
  </tr>`);

  // แถวงบบริหารสำนักงาน (แยกต่างหาก)
  if (officeProjects.length > 0) {
    rows.push(makeRow(5, officeProjects, true));
  }

  // แถวรวมทั้งหมด (รวมงบบริหารสำนักงานด้วย)
  const tb = fp.reduce((a,p)=>a+(p.budget||0),0);
  const ts = fp.reduce((a,p)=>a+(p.spent||0),0);
  const tp = fp.reduce((a,p)=>a+(p.po||0),0);
  const tr2 = tb-ts-tp;
  const tpct = tb>0?Math.round((ts+tp)/tb*100):0;
  rows.push(`<tr style="background:#1c2333;color:#fff;font-weight:700">
    <td style="color:#fff">รวมทั้งหมด (4 ยุทธศาสตร์ + งบสำนักงาน)</td>
    <td style="text-align:center;color:#fff">${fp.length}</td>
    <td class="td-num" style="color:#fff">${fmtFull(tb)}</td>
    <td class="td-num" style="color:#fff">${fmtFull(ts)}</td>
    <td class="td-num" style="color:#fff">${fmtFull(tp)}</td>
    <td class="td-num" style="${tr2<0?'color:#fca5a5':'color:#fff'}">${fmtFull(tr2)}</td>
    <td>
      <div style="display:flex;align-items:center;gap:7px">
        <div style="flex:1;height:5px;background:rgba(255,255,255,.2);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.min(tpct,100)}%;background:#60a5fa;border-radius:99px"></div>
        </div>
        <span style="font-size:11px;color:rgba(255,255,255,.8);min-width:30px;text-align:right">${tpct}%</span>
      </div>
    </td>
    <td style="text-align:center;font-size:12px">
      <span style="color:#6ee7b7;margin-right:4px">✅${fp.filter(p=>p.status==='done').length}</span>
      <span style="color:#93c5fd;margin-right:4px">⏳${fp.filter(p=>p.status==='progress').length}</span>
      <span style="color:rgba(255,255,255,.5)">○${fp.filter(p=>p.status==='pending').length}</span>
    </td>
  </tr>`);
  el.innerHTML = rows.join('');
}

// ===== TABLE =====
function renderTable() {
  const filtered = getFiltered();
  const total=filtered.length;
  const pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
  if(currentPage>pages) currentPage=pages;
  const start=(currentPage-1)*PAGE_SIZE;
  const slice=filtered.slice(start,start+PAGE_SIZE);
  const tbody=document.getElementById('tableBody');
  if(!slice.length){
    tbody.innerHTML=`<tr><td colspan="12"><div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p>ไม่พบโครงการที่ค้นหา</p></div></td></tr>`;
  } else {
    tbody.innerHTML = slice.map((p,i)=>{
      const budget   = p.budget||0;
      const spent    = p.spent||0;
      const po       = p.po||0;
      const usedTotal= spent + po;
      const remaining= budget - usedTotal;
      const usedPct  = budget>0 ? Math.min(Math.round(usedTotal/budget*100),100) : 0;
      const kpiCount = (p.kpi||[]).length;
      const barColor = usedPct>=90?'var(--red)': usedPct>=70?'var(--amber)': 'var(--green)';
      return `<tr class="data-row" onclick="openDetail(${p.id})">
        <td style="color:var(--text3);text-align:center;font-size:12px;width:32px">${start+i+1}</td>
        <td class="td-name">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="user-select:text">${p.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>
            ${p.quarter&&p.quarter!=='all'?`<span style="font-size:10px;background:var(--accent-light);color:var(--accent);padding:1px 6px;border-radius:4px;font-weight:600;flex-shrink:0">Q${p.quarter}</span>`:''}
            ${(p.committees||[]).length>0?`<span style="font-size:10px;background:#f0fdf4;color:#166534;padding:1px 6px;border-radius:4px;font-weight:600;flex-shrink:0">👥 ${(p.committees||[]).map(c=>c.replace('ด้าน','')).join(', ')}</span>`:''}
          </div>
        </td>
        <td><span class="badge ${S_BADGE[p.strategy]}">${S_NAMES[p.strategy]}</span></td>
        <td class="td-num" style="font-weight:600">${fmtFull(budget)}</td>
        <td class="td-num" style="color:var(--green)">${fmtFull(spent)}</td>
        <td class="td-num" style="color:var(--amber)">${po>0?fmtFull(po):'<span style="color:var(--text3)">—</span>'}</td>
        <td class="td-num">
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
            <span style="font-weight:700;color:${usedPct>=90?'var(--red)':'var(--text)'}">${fmtFull(usedTotal)}</span>
            <div style="width:64px;height:4px;background:var(--surface2);border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${usedPct}%;background:${barColor};border-radius:99px;transition:width .4s"></div>
            </div>
            <span style="font-size:10px;color:var(--text3)">${usedPct}% ของงบ</span>
          </div>
        </td>
        <td class="td-num" style="font-weight:600;color:${remaining<0?'var(--red)':remaining===0?'var(--text3)':'var(--text)'}">${fmtFull(remaining)}</td>
        <td><span class="badge ${STATUS_CLASS[p.status]}">${STATUS_LABEL[p.status]}</span></td>
        <td style="text-align:center">
          ${kpiCount>0?`<span class="badge badge-s1">${kpiCount} ตัวชี้วัด</span>`:'<span style="color:var(--text3);font-size:11px">—</span>'}
        </td>
        <td style="min-width:130px;max-width:170px">
          ${p.lastEditedBy ? `
            <div style="display:flex;flex-direction:column;gap:2px">
              <span style="font-size:12px;font-weight:600;color:var(--accent);display:flex;align-items:center;gap:4px">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ${p.lastEditedBy.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
              </span>
              ${p.lastEditedByPosition?`<span style="font-size:10px;color:var(--text2)">${p.lastEditedByPosition.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`:''}
              ${p.lastEditedAt?`<span style="font-size:10px;color:var(--text3)">${p.lastEditedAt}</span>`:''}
            </div>
          ` : '<span style="color:var(--text3);font-size:11px">—</span>'}
        </td>
        <td class="td-actions" onclick="event.stopPropagation()">
          <div class="td-actions-inner">
            <button class="btn btn-sm btn-icon" title="ดูรายละเอียด" onclick="openDetail(${p.id})" style="color:var(--s5)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            ${_isEditable() ? `
            <button class="btn btn-sm btn-icon" title="แก้ไข" onclick="openEdit(${p.id})" style="color:var(--accent)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-sm btn-icon btn-danger" title="ลบ" onclick="confirmDelete(${p.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>` : ''}
          </div>
        </td>
      </tr>`;
    }).join('');
    // ── Footer totals row ──
    const allFiltered = getFiltered();
    const fTotalBudget = allFiltered.reduce((a,p)=>a+(p.budget||0),0);
    const fTotalSpent  = allFiltered.reduce((a,p)=>a+(p.spent||0),0);
    const fTotalPo     = allFiltered.reduce((a,p)=>a+(p.po||0),0);
    const fTotalUsed   = fTotalSpent + fTotalPo;
    const fTotalRem    = fTotalBudget - fTotalUsed;
    const fUsedPct     = fTotalBudget>0?Math.round(fTotalUsed/fTotalBudget*100):0;
    tbody.innerHTML += `<tr style="background:linear-gradient(135deg,var(--surface2),#eef2fd);font-weight:700;border-top:2px solid var(--border2)">
      <td colspan="3" style="font-size:12px;color:var(--text2);padding-left:1rem">รวมทั้งหมด ${allFiltered.length} โครงการ (กรองแล้ว)</td>
      <td class="td-num" style="font-weight:800">${fmtFull(fTotalBudget)}</td>
      <td class="td-num" style="color:var(--green);font-weight:700">${fmtFull(fTotalSpent)}</td>
      <td class="td-num" style="color:var(--amber);font-weight:700">${fmtFull(fTotalPo)}</td>
      <td class="td-num">
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
          <span style="font-weight:800;color:var(--accent)">${fmtFull(fTotalUsed)}</span>
          <div style="width:72px;height:4px;background:var(--border2);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${fUsedPct}%;background:var(--accent);border-radius:99px"></div>
          </div>
          <span style="font-size:10px;color:var(--text3)">${fUsedPct}% ของงบ</span>
        </div>
      </td>
      <td class="td-num" style="font-weight:800;color:${fTotalRem<0?'var(--red)':'var(--text)'}">${fmtFull(fTotalRem)}</td>
      <td colspan="4"></td>
    </tr>`;
  }
  document.getElementById('paginationInfo').textContent=`แสดง ${Math.min(start+1,total)}–${Math.min(start+PAGE_SIZE,total)} จากทั้งหมด ${total} โครงการ`;
  const btns=document.getElementById('paginationBtns');
  let html=`<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage<=1?'disabled':''}>‹</button>`;
  for(let i=1;i<=pages;i++){
    if(pages<=7||Math.abs(i-currentPage)<=1||i===1||i===pages){
      html+=`<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if(Math.abs(i-currentPage)===2){
      html+=`<button class="page-btn" disabled>…</button>`;
    }
  }
  html+=`<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage>=pages?'disabled':''}>›</button>`;
  btns.innerHTML=html;
}

function goPage(p){
  const filtered=getFiltered();
  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  currentPage=Math.max(1,Math.min(p,pages));
  renderTable();
}
function getFiltered(){
  const q=(document.getElementById('searchInput').value||'').toLowerCase();
  const fs=document.getElementById('filterStrategy').value;
  const fst=document.getElementById('filterStatus').value;
  const fq=(document.getElementById('filterQuarterTable')||{}).value||'';
  const fc=(document.getElementById('filterCommittee')||{}).value||'';
  return projects.filter(p=>{
    if(q && !p.name.toLowerCase().includes(q)) return false;
    if(fs && p.strategy!=fs) return false;
    if(fst && p.status!==fst) return false;
    if(fq && p.quarter!==fq && p.quarter!=='all') return false;
    if(fc){
      const coms = p.committees || [];
      if(fc==='__none__') return coms.length===0;
      return coms.some(c=>c.includes(fc));
    }
    return true;
  });
}

function filterByCommittee(key){
  showPage('projects');
  setTimeout(()=>{
    const el=document.getElementById('filterCommittee');
    if(el){ el.value=key; renderTable(); }
  }, 80);
}

// ===== MODAL =====
function openAdd(){
  if(!_isEditable()){ showToast('🔒 กรุณาเข้าสู่ระบบก่อนเพิ่มโครงการ', 2500); return; }
  editingId=null; tempKPIs=[]; tempImages=[];
  document.getElementById('modalTitle').textContent='เพิ่มโครงการใหม่';
  ['editId','fName','fOwner'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fStrategy').value='1';
  document.getElementById('fBudget').value='0';
  document.getElementById('fSpent').value='0';
  document.getElementById('fPO').value='0';
  document.getElementById('fStatus').value='progress';
  document.getElementById('fQuarter').value='2';
  document.getElementById('fResult').value='';
  document.getElementById('fProblems').value='';
  document.getElementById('fSolutions').value='';
  document.getElementById('fEditorName').value=_editorDisplayName() || '— กรุณาเข้าสู่ระบบ —';
  document.getElementById('fEditedAt').value='';
  setComCheckboxes([]);
  document.getElementById('kpiInput').value='';
  renderKPIList(); renderImgPreview();
  document.getElementById('modalOverlay').classList.add('open');
  setTimeout(()=>document.getElementById('fName').focus(),100);
}

function openEdit(id){
  if(!_isEditable()){ showToast('🔒 กรุณาเข้าสู่ระบบก่อนแก้ไขโครงการ', 2500); return; }
  const p=projects.find(x=>x.id==id); if(!p) return;
  editingId=id; tempKPIs=[...(p.kpi||[])];
  // โหลดรูปเดิม — แต่ละรูปมี url และ driveId อยู่แล้ว ไม่ต้อง upload ซ้ำ
  tempImages=(p.images||[]).map(img=>({
    name:     img.name     || '',
    url:      img.url      || img.dataUrl || '',
    publicId: img.publicId || img.driveId  || '',
    _uploading: false,
    _dataUrl: img.url || img.dataUrl || ''
  }));
  document.getElementById('modalTitle').textContent='แก้ไขโครงการ';
  document.getElementById('editId').value=id;
  document.getElementById('fName').value=p.name;
  document.getElementById('fStrategy').value=p.strategy;
  document.getElementById('fBudget').value=p.budget||0;
  document.getElementById('fSpent').value=p.spent||0;
  document.getElementById('fPO').value=p.po||0;
  document.getElementById('fStatus').value=p.status;
  document.getElementById('fQuarter').value=p.quarter||'all';
  document.getElementById('fResult').value=p.result||'';
  document.getElementById('fProblems').value=p.problems||'';
  document.getElementById('fSolutions').value=p.solutions||'';
  document.getElementById('fOwner').value=p.owner||'';
  setComCheckboxes(p.committees||[]);
  document.getElementById('fEditorName').value=_editorDisplayName() || '— กรุณาเข้าสู่ระบบ —';
  document.getElementById('fEditedAt').value=p.lastEditedAt?(p.lastEditedAt+(p.lastEditedBy?' โดย '+p.lastEditedBy+(p.lastEditedByPosition?' ('+p.lastEditedByPosition+')':''):'')):'— ยังไม่เคยแก้ไข —';
  document.getElementById('kpiInput').value='';
  renderKPIList(); renderImgPreview();
  document.getElementById('modalOverlay').classList.add('open');
  closeDetail();
}

function closeModal(){ document.getElementById('modalOverlay').classList.remove('open'); }

function saveProject(){
  if(!_isEditable()){ showToast('🔒 กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล', 2500); return; }
  const name=document.getElementById('fName').value.trim();
  if(!name){alert('กรุณากรอกชื่อโครงการ');return;}

  // รอรูปที่กำลัง upload อยู่ให้เสร็จก่อน
  const stillUploading = tempImages.filter(i=>i._uploading);
  if(stillUploading.length){
    showToast(`⏳ รอรูปภาพ ${stillUploading.length} รูปอัปโหลดให้เสร็จก่อนครับ`, 3000);
    return;
  }

  // ส่งเฉพาะ field ที่จำเป็น ไม่ส่ง _dataUrl/_uploading/_driveError ขึ้น Sheet
  const cleanImages = tempImages.map(img=>({
    name:     img.name     || '',
    url:      img.url      || '',
    publicId: img.publicId || ''
  }));

  const data={
    name, strategy:document.getElementById('fStrategy').value,
    budget:parseFloat(document.getElementById('fBudget').value)||0,
    spent:parseFloat(document.getElementById('fSpent').value)||0,
    po:parseFloat(document.getElementById('fPO').value)||0,
    status:document.getElementById('fStatus').value,
    quarter:document.getElementById('fQuarter').value,
    result:document.getElementById('fResult').value.trim(),
    kpi:[...tempKPIs],
    problems:document.getElementById('fProblems').value.trim(),
    solutions:document.getElementById('fSolutions').value.trim(),
    owner:document.getElementById('fOwner').value.trim(),
    committees:getComCheckboxes(),
    images: cleanImages,
    lastEditedBy: _currentUser?.name || 'ผู้ใช้',
    lastEditedByPosition: _currentUser?.position || '',
    lastEditedAt: new Date().toLocaleString('th-TH',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})
  };
  const imgCount = cleanImages.length;
  const imgLabel = imgCount>0 ? ` · รูปภาพ ${imgCount} รูป (Cloudinary)` : '';

  if(editingId){
    data.id=editingId;
    const i=projects.findIndex(p=>p.id==editingId);
    if(i>=0) projects[i]={...projects[i],...data};
    // บันทึก local และ render ทันที — ข้อมูลถูกต้องอยู่แล้ว ไม่ต้องรอ Sheet
    window._pendingSaveTs = Date.now();
    saveToLocal(true); closeModal(); renderTable(); updateDashboard(); ltCaptureSnapshot();
    if(GAS_ENABLED){
      showToast('⏳ กำลังบันทึกขึ้น Google Sheet...', 2000);
      gasPost('update',{data})
        .then(res=>{
          if(res && res.success){
            showSavePopup('อัปเดตสำเร็จ! ✅', `แก้ไขข้อมูลโครงการเรียบร้อยแล้ว${imgLabel}`);
          } else {
            showToast('⚠️ GAS ตอบกลับผิดปกติ — ข้อมูลบันทึกในเครื่องแล้ว', 3000);
          }
        })
        .catch(()=>showToast('⚠️ บันทึกในเครื่องแล้ว แต่ Sync Sheet ไม่สำเร็จ', 3000));
    } else {
      showSavePopup('อัปเดตสำเร็จ! ✅', `แก้ไขข้อมูลโครงการเรียบร้อยแล้ว${imgLabel}`);
    }
  } else {
    const maxId=projects.reduce((m,p)=>Math.max(m,Number(p.id)||0),0);
    data.id=maxId+1;
    projects.push(data);
    // บันทึก local และ render ทันที — ข้อมูลถูกต้องอยู่แล้ว ไม่ต้องรอ Sheet
    window._pendingSaveTs = Date.now();
    saveToLocal(true); closeModal(); renderTable(); updateDashboard(); ltCaptureSnapshot();
    if(GAS_ENABLED){
      showToast('⏳ กำลังบันทึกขึ้น Google Sheet...', 2000);
      gasPost('save',{data})
        .then(res=>{
          if(res && res.success){
            showSavePopup('บันทึกสำเร็จ! ✅', `เพิ่มโครงการใหม่เรียบร้อยแล้ว${imgLabel}`);
          } else {
            showToast('⚠️ GAS ตอบกลับผิดปกติ — ข้อมูลบันทึกในเครื่องแล้ว', 3000);
          }
        })
        .catch(()=>showToast('⚠️ บันทึกในเครื่องแล้ว แต่ Sync Sheet ไม่สำเร็จ', 3000));
    } else {
      showSavePopup('บันทึกสำเร็จ! ✅', `เพิ่มโครงการใหม่เรียบร้อยแล้ว${imgLabel}`);
    }
  }
}

// ===== KPI =====
function addKPI(){
  const v=document.getElementById('kpiInput').value.trim(); if(!v) return;
  tempKPIs.push(v); document.getElementById('kpiInput').value=''; renderKPIList();
}
function removeKPI(i){ tempKPIs.splice(i,1); renderKPIList(); }
function renderKPIList(){
  const el=document.getElementById('kpiList');
  if(!tempKPIs.length){el.innerHTML='<span style="font-size:11px;color:var(--text3)">ยังไม่มีตัวชี้วัด</span>';return;}
  el.innerHTML=tempKPIs.map((k,i)=>`<span class="kpi-tag">${k}<button onclick="removeKPI(${i})" title="ลบ">×</button></span>`).join('');
}

// ===== DETAIL =====
function openDetail(id){
  const p=projects.find(x=>x.id==id); if(!p) return;
  document.getElementById('detailTitle').textContent=p.name;
  const editBtn = document.getElementById('detailEditBtn');
  editBtn.onclick=()=>openEdit(id);
  editBtn.style.display = _isEditable() ? '' : 'none';
  const remaining=(p.budget||0)-(p.spent||0)-(p.po||0);
  const kpis=p.kpi||[];
  document.getElementById('detailBody').innerHTML=`
    <div class="detail-section">
      <div class="detail-section-title">ข้อมูลทั่วไป</div>
      <div class="detail-grid">
        <div class="detail-item"><div class="detail-item-label">ยุทธศาสตร์</div><div class="detail-item-value"><span class="badge ${S_BADGE[p.strategy]}">${S_NAMES[p.strategy]}</span></div></div>
        <div class="detail-item"><div class="detail-item-label">สถานะ</div><div class="detail-item-value"><span class="badge ${STATUS_CLASS[p.status]}">${STATUS_LABEL[p.status]}</span></div></div>
        <div class="detail-item"><div class="detail-item-label">ไตรมาส</div><div class="detail-item-value">${Q_LABEL[p.quarter||'all']}</div></div>
        <div class="detail-item"><div class="detail-item-label">งบประมาณที่อนุมัติ</div><div class="detail-item-value">${fmtFull(p.budget)} บาท</div></div>
        <div class="detail-item"><div class="detail-item-label">งบประมาณที่ใช้ไป</div><div class="detail-item-value">${fmtFull(p.spent)} บาท</div></div>
        <div class="detail-item"><div class="detail-item-label">PO</div><div class="detail-item-value">${fmtFull(p.po)} บาท</div></div>
        <div class="detail-item"><div class="detail-item-label">งบประมาณคงเหลือสุทธิ</div><div class="detail-item-value" style="${remaining<0?'color:var(--red)':''}">${fmtFull(remaining)} บาท</div></div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">👥 ผู้รับผิดชอบและอนุกรรมการ</div>
      <div class="detail-grid">
        <div class="detail-item" style="grid-column:1/-1">
          <div class="detail-item-label">ผู้รับผิดชอบโครงการ / หน่วยงาน</div>
          <div class="detail-item-value">${p.owner?escapeHtml(p.owner):'<span style="color:var(--text3);font-weight:400">ไม่ได้ระบุ</span>'}</div>
        </div>
        <div class="detail-item" style="grid-column:1/-1">
          <div class="detail-item-label">อนุกรรมการที่เกี่ยวข้อง</div>
          <div class="detail-item-value" style="margin-top:4px">
            ${(p.committees&&p.committees.length)
              ? p.committees.map(c=>`<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;background:var(--accent-light);color:var(--accent);margin:2px 3px 2px 0">🏛 ${escapeHtml(c)}</span>`).join('')
              : '<span style="color:var(--text3);font-weight:400;font-size:12px">ไม่ได้ระบุ</span>'}
          </div>
        </div>
      </div>
    </div>
    ${p.result?`<div class="detail-section"><div class="detail-section-title">ผลการดำเนินงาน</div><div class="detail-text">${escapeHtml(p.result)}</div></div>`:''}
    <div class="detail-section">
      <div class="detail-section-title">ตัวชี้วัดความสำเร็จของโครงการ (KPI)</div>
      ${kpis.length?`<div class="kpi-box">${kpis.map(k=>`<div class="kpi-item"><div class="kpi-dot"></div><span>${escapeHtml(k)}</span></div>`).join('')}</div>`:'<span style="font-size:12px;color:var(--text3)">ยังไม่ได้กำหนดตัวชี้วัด</span>'}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">ปัญหาและอุปสรรค</div>
      ${p.problems?`<div class="problem-box">${escapeHtml(p.problems)}</div>`:'<span style="font-size:12px;color:var(--text3)">ไม่มีปัญหาและอุปสรรค</span>'}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">แนวทางแก้ไข / ข้อเสนอแนะ</div>
      ${p.solutions?`<div class="solution-box">${escapeHtml(p.solutions)}</div>`:'<span style="font-size:12px;color:var(--text3)">ไม่มีแนวทางแก้ไข</span>'}
    </div>
    ${(p.images&&p.images.length)?`
    <div class="detail-section">
      <div class="detail-section-title">📸 รูปภาพประกอบการดำเนินงาน (${p.images.length} รูป)</div>
      <div class="detail-img-gallery">
        ${p.images.map((img,i)=>{
          const src = driveImgUrl(img);
          const driveId = img.driveId||'';
          return `<div class="detail-img-item" onclick="openDetailImgLightbox(${p.id},${i})" title="${escapeHtml(img.name||'')}">
            <img src="${src}" alt="${escapeHtml(img.name||'รูปภาพ')}"
              data-drive-id="${driveId}" data-tried="0"
              onerror="onImgError(this)">
          </div>`;
        }).join('')}
      </div>
    </div>`:''}
    ${(p.lastEditedBy||p.lastEditedAt)?`
    <div class="detail-section">
      <div class="detail-section-title">✏️ ข้อมูลการแก้ไขล่าสุด</div>
      <div style="display:flex;align-items:center;gap:12px;background:var(--accent-light);border:1px solid #bfcff8;border-radius:var(--radius);padding:.875rem 1rem">
        <div style="width:40px;height:40px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(59,114,240,.3)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:var(--accent)">${escapeHtml(p.lastEditedBy||'ไม่ระบุชื่อ')}</div>
          ${p.lastEditedByPosition?`<div style="font-size:12px;color:var(--text2);margin-top:1px">${escapeHtml(p.lastEditedByPosition)}</div>`:''}
          <div style="font-size:11px;color:var(--text2);margin-top:2px">🕐 แก้ไขเมื่อ ${escapeHtml(p.lastEditedAt||'')}</div>
        </div>
      </div>
    </div>`:''}
  `;
  document.getElementById('detailOverlay').classList.add('open');
}
function closeDetail(){ document.getElementById('detailOverlay').classList.remove('open'); }
function escapeHtml(str){ return (str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }

// ดึง URL รูปภาพ — Cloudinary URL อยู่ใน img.url แล้ว
// รองรับข้อมูลเก่าที่มี driveId
function driveImgUrl(img){
  if(!img) return '';
  if(img.url && !img.url.includes('thumbnail?id=')) return img.url;
  if(img.driveId) return 'https://lh3.googleusercontent.com/d/' + img.driveId;
  return img.dataUrl || '';
}

function onImgError(el, img){
  // Cloudinary URLs ไม่ต้อง fallback แต่รองรับรูปเก่าจาก Drive
  const id = el.dataset.driveId;
  if(!id) return;
  const tried = parseInt(el.dataset.tried||'0');
  const fallbacks = [
    'https://lh3.googleusercontent.com/d/' + id,
    'https://drive.google.com/uc?export=view&id=' + id
  ];
  if(tried < fallbacks.length){
    el.dataset.tried = tried + 1;
    el.src = fallbacks[tried];
  }
}
function openDetailImgLightbox(projectId, idx){
  const p = projects.find(x=>x.id==projectId); if(!p||!p.images) return;
  openLightboxGallery(p.images.map(i=>driveImgUrl(i)), idx);
}

// ===== DELETE =====
function confirmDelete(id){
  if(!_isEditable()){ showToast('🔒 กรุณาเข้าสู่ระบบก่อนลบโครงการ', 2500); return; }
  const p=projects.find(x=>x.id==id); if(!p) return;
  deleteId=id;
  document.getElementById('deleteName').textContent=p.name;
  document.getElementById('confirmDeleteBtn').onclick=()=>doDelete();
  document.getElementById('deleteOverlay').classList.add('open');
}
function doDelete(){
  const p=projects.find(x=>x.id==deleteId);
  // ลบรูปภาพออกจาก Drive ด้วย (async)
  if(p&&p.images&&GAS_ENABLED){
    p.images.forEach(img=>{ if(img.publicId) gasPost('deleteCloudinaryImage',{publicId:img.publicId}).catch(()=>{}); });
  }
  projects=projects.filter(p=>p.id!=deleteId);
  document.getElementById('deleteOverlay').classList.remove('open');
  saveToLocal(); renderTable(); updateDashboard(); ltCaptureSnapshot();
  if(GAS_ENABLED) gasPost('delete',{id:deleteId})
    .then(()=>showToast('🗑️ ลบโครงการสำเร็จ',2500))
    .catch(()=>showToast('⚠️ ลบในเครื่องแล้ว แต่ Sync Sheet ไม่สำเร็จ',3000));
}

// ===== IMAGE UPLOAD (Cloudinary) =====
// tempImages เก็บ {name, url, publicId, _dataUrl(ชั่วคราวสำหรับ preview), _uploading}
let tempImages = [];
let lightboxImages = [];
let lightboxIdx = 0;

function handleImgSelect(e){
  addImagesToTemp(Array.from(e.target.files));
  e.target.value = '';
}
function handleImgDragOver(e){ e.preventDefault(); document.getElementById('imgUploadZone').classList.add('drag-over'); }
function handleImgDragLeave(e){ document.getElementById('imgUploadZone').classList.remove('drag-over'); }
function handleImgDrop(e){
  e.preventDefault();
  document.getElementById('imgUploadZone').classList.remove('drag-over');
  addImagesToTemp(Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')));
}

function addImagesToTemp(files){
  const remaining = 10 - tempImages.length;
  if(remaining <= 0){ showToast('อัปโหลดรูปได้สูงสุด 10 รูปเท่านั้น'); return; }
  const toAdd = files.slice(0, remaining);
  if(files.length > remaining) showToast(`เพิ่มได้อีก ${remaining} รูป`);

  toAdd.forEach(file => {
    if(file.size > 20*1024*1024){ showToast(`${file.name}: ไฟล์ใหญ่เกิน 20MB`); return; }

    // สร้าง placeholder ก่อนเพื่อ preview ทันที
    const placeholder = { name: file.name, url: '', publicId: '', _uploading: true, _dataUrl: '', _progress: 0 };
    tempImages.push(placeholder);
    renderImgPreview();

    // resize + compress ก่อน upload
    resizeImage(file).then(base64Full => {
      placeholder._dataUrl = base64Full;
      renderImgPreview();

      const kb = Math.round(base64Full.length * 0.75 / 1024);
      showToast(`⏳ กำลังอัปโหลด "${file.name}" (${kb} KB)...`, 1500);

      function doUpload(attempt){
        cloudinaryUpload(base64Full, file.name)
          .then(res => {
            placeholder.url        = res.url;
            placeholder.publicId   = res.publicId;
            placeholder._uploading = false;
            placeholder._dataUrl   = res.url; // ใช้ Cloudinary URL แทน base64 ประหยัด memory
            renderImgPreview();
            showToast(`✅ "${file.name}" อัปโหลดสำเร็จ${attempt>1?' (retry)':''}`, 2500);
          })
          .catch(err => {
            console.error(`Upload attempt ${attempt} failed:`, err.message);
            if(attempt < 3){
              showToast(`⏳ retry ${attempt}/2 — "${file.name}"`, 1500);
              setTimeout(()=>doUpload(attempt+1), 2000);
            } else {
              placeholder.url        = base64Full;
              placeholder._uploading = false;
              placeholder._uploadError = true;
              renderImgPreview();
              showToast(`⚠️ อัปโหลดไม่สำเร็จหลัง 3 ครั้ง: ${err.message}`, 5000);
            }
          });
      }
      doUpload(1);
    });
  });
}

// ── Resize + Compress รูปก่อน upload ────────────────────────
// - resize ด้านยาวสุดไม่เกิน 1400px (คมชัด พอสำหรับรายงาน)
// - บีบอัดเป็น JPEG quality 0.82 → ลดขนาด ~70-85% จากต้นฉบับ
// - PNG/GIF ก็แปลงเป็น JPEG เพื่อลดขนาด (ยกเว้น WebP ซึ่งบีบดีอยู่แล้ว)
const IMG_MAX_PX      = 1400;   // px ด้านยาวสุด
const IMG_JPEG_QUALITY = 0.82;  // 0.82 = คมชัด, ไฟล์เล็ก

function resizeImage(file, _unused){
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        // resize ถ้าเกิน max
        if(w > IMG_MAX_PX || h > IMG_MAX_PX){
          if(w > h){ h = Math.round(h * IMG_MAX_PX / w); w = IMG_MAX_PX; }
          else      { w = Math.round(w * IMG_MAX_PX / h); h = IMG_MAX_PX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        // แปลงทุก format เป็น JPEG เพื่อขนาดเล็กที่สุด (ยกเว้น WebP)
        const outType = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
        resolve(canvas.toDataURL(outType, IMG_JPEG_QUALITY));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function removeImgTemp(i){
  const img = tempImages[i];
  // ลบออกจาก Cloudinary (ผ่าน GAS เพราะต้องใช้ API secret)
  if(img && img.publicId && GAS_ENABLED){
    gasPost('deleteCloudinaryImage', { publicId: img.publicId }).catch(()=>{});
  }
  tempImages.splice(i, 1);
  renderImgPreview();

  // อัปเดต images_json ใน Sheet ทันที ไม่รอกดบันทึก
  if(editingId && GAS_ENABLED){
    const cleanImages = tempImages.map(img=>({
      name: img.name || '', url: img.url || '', publicId: img.publicId || ''
    }));
    const proj = projects.find(p=>p.id==editingId);
    if(proj){
      proj.images = cleanImages;
      saveToLocal(true);
      gasPost('updateImages', { id: String(editingId), images: JSON.stringify(cleanImages) })
        .catch(()=>showToast('⚠️ ลบรูปแล้ว แต่ Sync Sheet ไม่สำเร็จ', 3000));
    }
  }
}

function renderImgPreview(){
  const grid     = document.getElementById('imgPreviewGrid');
  const info     = document.getElementById('imgCountInfo');
  const countTxt = document.getElementById('imgCountText');
  if(!grid) return;
  if(!tempImages.length){ grid.innerHTML=''; info.style.display='none'; return; }

  grid.innerHTML = tempImages.map((img, i) => {
    const src = img._dataUrl || driveImgUrl(img) || '';
    const uploading = img._uploading;
    const hasError  = img._driveError;
    return `
    <div class="img-preview-item" style="position:relative">
      ${src ? `<img src="${src}" alt="${escapeHtml(img.name)}" onclick="${uploading?'':'openLightboxTemp('+i+')'}">` : '<div style="width:100%;height:100%;background:var(--surface2)"></div>'}
      ${uploading ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;border-radius:var(--radius)">
        <div style="width:22px;height:22px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite"></div>
      </div>` : ''}
      ${hasError ? `<div style="position:absolute;top:3px;left:3px;background:var(--amber);color:#fff;font-size:9px;padding:1px 4px;border-radius:3px">⚠️</div>` : ''}
      ${!uploading ? `<button class="img-remove" onclick="removeImgTemp(${i})" title="ลบรูป">✕</button>` : ''}
      <div class="img-caption">${escapeHtml(img.name)}</div>
    </div>`;
  }).join('');

  info.style.display = 'inline-flex';
  const ready = tempImages.filter(i=>!i._uploading).length;
  const total = tempImages.length;
  countTxt.textContent = total===ready ? `${total} รูป (พร้อมใช้งาน)` : `${ready}/${total} รูป (กำลังอัปโหลด...)`;
}

function openLightboxTemp(idx){
  // ถ้ายังมีรูปที่กำลัง upload อยู่ ข้ามไป
  const ready = tempImages.filter(i=>!i._uploading);
  if(!ready.length) return;
  // สร้าง index mapping
  const readyIdx = tempImages.filter((img,i)=>!img._uploading);
  lightboxImages = readyIdx.map(i=>i.url||i._dataUrl);
  lightboxIdx = Math.min(idx, lightboxImages.length-1);
  showLightbox();
}

function openLightboxGallery(images, idx){
  lightboxImages = images;
  lightboxIdx = idx;
  showLightbox();
}

function showLightbox(){
  document.getElementById('lightboxImg').src = lightboxImages[lightboxIdx];
  document.getElementById('lightboxCounter').textContent = `${lightboxIdx+1} / ${lightboxImages.length}`;
  document.getElementById('lightboxOverlay').classList.add('open');
}

function closeLightbox(){ document.getElementById('lightboxOverlay').classList.remove('open'); }

function lightboxNav(dir){
  lightboxIdx = (lightboxIdx + dir + lightboxImages.length) % lightboxImages.length;
  showLightbox();
}

// ===== COMMITTEE DROPDOWN =====
const COM_OPTIONS = [
  {id:'chkPolicy',   value:'นโยบายและแผนงาน'},
  {id:'chkAcademic', value:'วิชาการ'},
  {id:'chkTech',     value:'เทคนิคและเทคโนโลยีดิจิทัล'},
  {id:'chkHR',       value:'บริหารงานบุคคล'},
];

function toggleComPanel(){
  const trigger = document.getElementById('comTrigger');
  const panel   = document.getElementById('comPanel');
  const isOpen  = panel.classList.contains('open');
  if(isOpen){ panel.classList.remove('open'); trigger.classList.remove('open'); }
  else       { panel.classList.add('open');   trigger.classList.add('open'); }
}

function updateComTrigger(){
  const selected = getComCheckboxes();
  const textEl   = document.getElementById('comTriggerText');
  if(!selected.length){
    textEl.innerHTML = '<span class="com-placeholder">— เลือกอนุกรรมการที่เกี่ยวข้อง —</span>';
  } else {
    textEl.innerHTML = selected.map(v=>`<span class="com-tag">อนุฯ ${v}</span>`).join('');
  }
}

function getComCheckboxes(){
  return COM_OPTIONS.filter(o=>document.getElementById(o.id)?.checked).map(o=>o.value);
}

// เลือกได้เพียงรายการเดียวเท่านั้น (คลิกซ้ำที่รายการเดิมเพื่อยกเลิกการเลือก)
function onComOptionChange(el){
  if(el.checked){
    COM_OPTIONS.forEach(o=>{
      const cb = document.getElementById(o.id);
      if(cb && cb!==el) cb.checked = false;
    });
  }
  updateComTrigger();
}

function setComCheckboxes(arr){
  COM_OPTIONS.forEach(o=>{
    const el = document.getElementById(o.id);
    if(el) el.checked = arr.includes(o.value);
  });
  updateComTrigger();
}

// Close dropdown when clicking outside
document.addEventListener('click', e=>{
  const wrap = document.getElementById('comDropdownWrap');
  if(wrap && !wrap.contains(e.target)){
    document.getElementById('comPanel')?.classList.remove('open');
    document.getElementById('comTrigger')?.classList.remove('open');
  }
});

// ===== COMMITTEE SUMMARY =====

const COM_LIST = [
  { key: 'นโยบายและแผนงาน',           label: 'ด้านนโยบายและแผนงาน',           color: '#3b72f0', colorLight: '#eef2fd', icon: '📋' },
  { key: 'วิชาการ',                    label: 'ด้านวิชาการ',                   color: '#059669', colorLight: '#ecfdf5', icon: '📚' },
  { key: 'เทคนิคและเทคโนโลยีดิจิทัล', label: 'ด้านเทคนิคและเทคโนโลยีดิจิทัล', color: '#d97706', colorLight: '#fffbeb', icon: '💻' },
  { key: 'บริหารงานบุคคล',             label: 'ด้านบริหารงานบุคคล',             color: '#9333ea', colorLight: '#faf5ff', icon: '👥' },
];
// โครงการที่ไม่ถูก assign อนุกรรมการ
const COM_UNASSIGNED = { key: '__none__', label: 'ไม่ได้ระบุอนุกรรมการ', color: '#9aa3b2', colorLight: '#f9fafb', icon: '—' };

function _getCommittees(p) {
  // committees อาจเป็น array ของ string หรือ object {name, role}
  const raw = p.committees || [];
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(c => (typeof c === 'string' ? c : (c.name || c.key || ''))).filter(Boolean);
}

// คำนวณ stats per committee key
function _comStats(fp) {
  const map = {};
  [...COM_LIST, COM_UNASSIGNED].forEach(c => {
    map[c.key] = { projects: [], budget: 0, spent: 0, po: 0, done: 0, progress: 0, pending: 0 };
  });

  // กรองงบบริหารสำนักงาน (strategy 5) ออก — ไม่อยู่ในระบบอนุกรรมการ
  fp.filter(p => String(p.strategy) !== '5').forEach(p => {
    const coms = _getCommittees(p);
    const targets = coms.length > 0 ? coms : [COM_UNASSIGNED.key];
    // โครงการ 1 โครงการอาจอยู่ในหลายอนุกรรมการ — นับโครงการซ้ำได้ แต่งบประมาณ pro-rate
    const share = 1 / targets.length;
    targets.forEach(key => {
      const validKey = COM_LIST.find(c => c.key === key) ? key : COM_UNASSIGNED.key;
      const d = map[validKey];
      if (!d.projects.includes(p.id)) d.projects.push(p.id);
      d.budget  += (p.budget || 0) * share;
      d.spent   += (p.spent  || 0) * share;
      d.po      += (p.po     || 0) * share;
      if (p.status === 'done')     d.done++;
      else if (p.status === 'progress') d.progress++;
      else d.pending++;
    });
  });
  return map;
}

// ══════════════════════════════════════════════════════
// Export PDF แยกตามคณะอนุกรรมการ — รูปเล่มฉบับสมบูรณ์ (ปีงบประมาณ 2569)
// ใช้วิธีเปิดหน้าต่างพิมพ์ (window.print ผ่านหน้าต่างใหม่) แทน html2canvas ที่ใช้กับรายงานความเสี่ยง
// เพราะเนื้อหามีหลายหน้า/หลายโครงการ การแปลงเป็นภาพแบบ html2canvas จะตัดหน้ากระดาษไม่ตรงตำแหน่ง
// (ตัดกลางตาราง/กลางข้อความได้) จึงใช้ CSS print แบบ native ของเบราว์เซอร์แทน ให้ตัดหน้าได้แม่นยำกว่า
// ══════════════════════════════════════════════════════
const _COMMITTEE_LOGO_URL_69 = 'https://dltv.ac.th/upload/data/users/0/316/CMS/images/logo%20dlf%20%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C.png';
const S_COLORS_69 = {1:'#3b72f0',2:'#059669',3:'#d97706',4:'#9333ea',5:'#0891b2'};

function _cpEsc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function _cpFmt(n){ return Math.round(n||0).toLocaleString('th-TH'); }
function _cpCell(txt, opts){
  const {bold,center,right,bg,color,small,width,colspan} = opts||{};
  return `<td ${colspan?'colspan="'+colspan+'"':''} style="border:1px solid #a9b6c9;padding:5px 7px;font-size:${small?'9.5':'10.5'}px;font-weight:${bold?'700':'400'};text-align:${center?'center':right?'right':'left'};background:${bg||'transparent'};color:${color||'#161c26'};${width?'width:'+width+';':''}vertical-align:middle">${txt!=null?txt:''}</td>`;
}
function _cpSectionHeader(num, title, color){
  return `<div style="background:${color||'#2c3e70'};color:#fff;font-weight:700;font-size:11px;padding:6px 12px;margin:16px 0 7px;border-radius:4px;display:flex;align-items:center;gap:7px">
    <span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 4px;background:rgba(255,255,255,.22);border-radius:9px;font-size:10px">${num}</span>
    <span>${title}</span>
  </div>`;
}

// หน้าปกเฉพาะของอนุกรรมการ (ธีมสีตามอนุกรรมการนั้น)
function _buildCommitteeCoverPageHTML_69(year, committee) {
  return `
  <div style="page-break-after:always;min-height:255mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 36px">
    <img src="${_COMMITTEE_LOGO_URL_69}" style="width:100px;height:auto;margin-bottom:22px" alt="logo">
    <div style="font-size:13px;letter-spacing:1px;color:#5a6a85;margin-bottom:10px">รายงานสรุปโครงการ</div>
    <div style="width:76px;height:76px;border-radius:50%;background:${committee.colorLight};border:3px solid ${committee.color};display:flex;align-items:center;justify-content:center;font-size:34px;margin-bottom:18px">${committee.icon}</div>
    <div style="font-size:22px;font-weight:700;color:${committee.color};line-height:1.6;margin-bottom:6px">อนุกรรมการ${_cpEsc(committee.label)}</div>
    <div style="font-size:14px;color:#333;margin-bottom:14px">ปีงบประมาณ พ.ศ. ${year}</div>
    <div style="width:96px;height:4px;border-radius:2px;background:linear-gradient(90deg,${committee.color},${committee.colorLight});margin:6px 0 26px"></div>
    <div style="font-size:14.5px;font-weight:600;color:#333;margin-bottom:4px">มูลนิธิการศึกษาทางไกลผ่านดาวเทียม</div>
    <div style="font-size:14.5px;font-weight:600;color:#333">ในพระบรมราชูปถัมภ์</div>
  </div>`;
}

// หน้าสรุปภาพรวมของอนุกรรมการนี้โดยเฉพาะ (ขอบเขตเฉพาะโครงการของอนุกรรมการนี้เท่านั้น)
function _buildCommitteeSummaryPageHTML_69(fp, year, committee) {
  const budget = fp.reduce((a,p)=>a+(p.budget||0),0);
  const spent  = fp.reduce((a,p)=>a+(p.spent||0),0);
  const po     = fp.reduce((a,p)=>a+(p.po||0),0);
  const remaining = budget - spent - po;
  const usedPct = budget > 0 ? Math.round((spent+po)/budget*100) : 0;
  const done = fp.filter(p=>p.status==='done').length;
  const prog = fp.filter(p=>p.status==='progress').length;
  const pend = fp.length - done - prog;
  const statusRows = [
    {label:'✅ แล้วเสร็จ', n:done, color:'#059669'},
    {label:'⏳ อยู่ระหว่างดำเนินการ', n:prog, color:'#d97706'},
    {label:'⭕ ยังไม่เริ่มดำเนินการ', n:pend, color:'#9aa3b2'},
  ];
  const listRows = fp.map((p,i)=>{
    const rem = (p.budget||0)-(p.spent||0)-(p.po||0);
    const zebra = i%2===1 ? '#f6f8fc' : '#fff';
    return `<tr>
      ${_cpCell(i+1,{center:true,bg:zebra})}
      ${_cpCell(_cpEsc(p.name||''),{bg:zebra})}
      ${_cpCell(_cpEsc(p.owner||''),{small:true,bg:zebra})}
      ${_cpCell(_cpFmt(p.budget),{right:true,bg:zebra})}
      ${_cpCell(_cpFmt(p.spent),{right:true,bg:zebra})}
      ${_cpCell(_cpFmt(p.po),{right:true,bg:zebra})}
      ${_cpCell(_cpFmt(rem),{right:true,color:'#059669',bg:zebra})}
      ${_cpCell(STATUS_LABEL[p.status]||'-',{center:true,small:true,bg:zebra})}
    </tr>`;
  }).join('');

  return `
  <div style="page-break-after:always;padding:6px 36px 28px;font-size:11px;line-height:1.7">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:15px;font-weight:700;color:${committee.color}">${committee.icon} สรุปภาพรวม อนุกรรมการ${_cpEsc(committee.label)}</div>
      <div style="font-size:10.5px;color:#666">ปีงบประมาณ พ.ศ. ${year} · ${fp.length} โครงการ</div>
    </div>
    <div style="font-size:10.5px;text-align:justify;margin-bottom:14px">
      อนุกรรมการ${_cpEsc(committee.label)} รับผิดชอบดูแลโครงการภายใต้แผนปฏิบัติการประจำปีงบประมาณ พ.ศ. ${year}
      รวมทั้งสิ้น <strong>${fp.length}</strong> โครงการ คิดเป็นงบประมาณรวม <strong>${_cpFmt(budget)}</strong> บาท
      ณ ปัจจุบันมีการเบิกจ่ายและก่อหนี้ผูกพัน (ใช้ไป + PO) แล้วรวม <strong>${_cpFmt(spent+po)}</strong> บาท
      คิดเป็นร้อยละ <strong>${usedPct}</strong> ของงบประมาณ คงเหลืองบประมาณที่ยังไม่ได้เบิกจ่ายอีก <strong>${_cpFmt(remaining)}</strong> บาท
    </div>
    ${_cpSectionHeader('ก','งบประมาณโดยสรุป',committee.color)}
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:10px">
      <tr>${_cpCell('งบประมาณรวมของอนุกรรมการ',{bold:true,bg:'#e3e9f6'})}${_cpCell(_cpFmt(budget)+' บาท',{right:true,bold:true,bg:'#e3e9f6',width:'150px'})}</tr>
      <tr>${_cpCell('ใช้ไป + PO (ก่อหนี้ผูกพัน)',{bg:'#f6f8fc'})}${_cpCell(_cpFmt(spent+po)+' บาท',{right:true,bg:'#f6f8fc',width:'150px'})}</tr>
      <tr>${_cpCell('คงเหลือ',{bold:true})}${_cpCell(_cpFmt(remaining)+' บาท',{right:true,bold:true,color:remaining<0?'#dc2626':'#059669',width:'150px'})}</tr>
    </table>
    ${_cpSectionHeader('ข','สถานะการดำเนินงานโครงการ',committee.color)}
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:10px">
      <tr>${_cpCell('สถานะโครงการ',{bold:true,bg:'#e3e9f6'})}${_cpCell('จำนวนโครงการ',{bold:true,center:true,bg:'#e3e9f6',width:'110px'})}${_cpCell('สัดส่วน',{bold:true,center:true,bg:'#e3e9f6',width:'90px'})}</tr>
      ${statusRows.map((r,i)=>{
        const zebra = i%2===1 ? '#f6f8fc' : '#fff';
        const pctS = fp.length ? Math.round(r.n/fp.length*100) : 0;
        return `<tr>${_cpCell(r.label,{color:r.color,bold:true,bg:zebra})}${_cpCell(r.n,{center:true,bg:zebra})}${_cpCell(pctS+'%',{center:true,bg:zebra})}</tr>`;
      }).join('')}
    </table>
    ${_cpSectionHeader('ค','รายชื่อโครงการทั้งหมด',committee.color)}
    <table style="width:100%;border-collapse:collapse;table-layout:fixed">
      <tr>
        ${_cpCell('ที่',{bold:true,center:true,bg:'#e3e9f6',width:'24px'})}
        ${_cpCell('ชื่อโครงการ',{bold:true,center:true,bg:'#e3e9f6'})}
        ${_cpCell('ผู้รับผิดชอบ',{bold:true,center:true,bg:'#e3e9f6',width:'90px',small:true})}
        ${_cpCell('งบอนุมัติ',{bold:true,center:true,bg:'#e3e9f6',width:'75px',small:true})}
        ${_cpCell('ใช้ไป',{bold:true,center:true,bg:'#e3e9f6',width:'70px',small:true})}
        ${_cpCell('PO',{bold:true,center:true,bg:'#e3e9f6',width:'65px',small:true})}
        ${_cpCell('คงเหลือ',{bold:true,center:true,bg:'#e3e9f6',width:'70px',small:true})}
        ${_cpCell('สถานะ',{bold:true,center:true,bg:'#e3e9f6',width:'70px',small:true})}
      </tr>
      ${listRows}
      <tr>
        ${_cpCell('รวม',{bold:true,center:true,bg:'#e3e9f6',colspan:2})}
        ${_cpCell('',{bg:'#e3e9f6'})}
        ${_cpCell(_cpFmt(budget),{right:true,bold:true,bg:'#eef2ff'})}
        ${_cpCell(_cpFmt(spent),{right:true,bold:true,bg:'#eef2ff'})}
        ${_cpCell(_cpFmt(po),{right:true,bold:true,bg:'#eef2ff'})}
        ${_cpCell(_cpFmt(remaining),{right:true,bold:true,color:'#059669',bg:'#eef2ff'})}
        ${_cpCell('',{bg:'#eef2ff'})}
      </tr>
    </table>
  </div>`;
}

// หน้ารายละเอียดโครงการ 1 หน้า/1 โครงการ (งบประมาณ สถานะ ตัวชี้วัด ผลการดำเนินงาน ปัญหา แนวทางแก้ไข รูปภาพ)
// noPadding: true เมื่อถูกฝังไว้ในรายงานอื่นที่มี padding รอบนอกอยู่แล้ว (เช่น รายงานภาพรวมยุทธศาสตร์) กันช่องว่างซ้ำ
function _buildProjectDetailPageHTML_69(p, year, isLast, noPadding) {
  const rem = (p.budget||0)-(p.spent||0)-(p.po||0);
  const kpis = p.kpi || [];
  const images = (p.images || []).map(img => driveImgUrl(img)).filter(Boolean);
  const imagesBlock = images.length ? `
    <div style="margin-bottom:10px">
      <div style="font-weight:700;font-size:11px;margin-bottom:6px">รูปภาพประกอบการดำเนินงาน (${images.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${images.map(src=>`<img src="${src}" style="width:130px;height:130px;object-fit:cover;border:1px solid #5a6a85;border-radius:4px">`).join('')}
      </div>
    </div>` : '';
  return `
  <div style="${isLast?'':'page-break-after:always;'}padding:${noPadding?'0':'6px 36px 28px'};font-size:11px;line-height:1.7">
    <div style="border-bottom:2px solid ${S_COLORS_69[p.strategy]||'#2c3e70'};padding-bottom:8px;margin-bottom:12px">
      <div style="font-size:14px;font-weight:700;color:#1e2f4f">${_cpEsc(p.name||'')}</div>
      <div style="font-size:10.5px;color:#666;margin-top:2px">${S_NAMES[p.strategy]||''}${p.owner?' · ผู้รับผิดชอบ: '+_cpEsc(p.owner):''}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:12px">
      <tr>${_cpCell('งบอนุมัติ (บาท)',{bold:true,center:true,bg:'#e3e9f6'})}${_cpCell('ใช้ไป (บาท)',{bold:true,center:true,bg:'#e3e9f6'})}${_cpCell('PO (บาท)',{bold:true,center:true,bg:'#e3e9f6'})}${_cpCell('คงเหลือ (บาท)',{bold:true,center:true,bg:'#e3e9f6'})}</tr>
      <tr>${_cpCell(_cpFmt(p.budget),{right:true})}${_cpCell(_cpFmt(p.spent),{right:true,color:'#059669'})}${_cpCell(_cpFmt(p.po),{right:true,color:'#d97706'})}${_cpCell(_cpFmt(rem),{right:true,bold:true,color:rem<0?'#dc2626':'#111'})}</tr>
    </table>
    <div style="margin-bottom:10px"><span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:10.5px;font-weight:600;background:#f0fdf4;color:#166534">สถานะ: ${STATUS_LABEL[p.status]||'-'}</span></div>
    ${kpis.length ? `<div style="margin-bottom:10px"><div style="font-weight:700;font-size:11px;margin-bottom:4px">ตัวชี้วัด (KPI)</div><ul style="margin:0;padding-left:18px">${kpis.map(k=>`<li>${_cpEsc(k)}</li>`).join('')}</ul></div>` : ''}
    ${p.result ? `<div style="margin-bottom:10px"><div style="font-weight:700;font-size:11px;margin-bottom:4px">ผลการดำเนินงาน</div><div style="border:1px solid #5a6a85;padding:8px 10px;white-space:pre-wrap;text-align:justify">${_cpEsc(p.result).replace(/\n/g,'<br>')}</div></div>` : ''}
    ${p.problems ? `<div style="margin-bottom:10px"><div style="font-weight:700;font-size:11px;margin-bottom:4px">ปัญหาและอุปสรรค</div><div style="border:1px solid #5a6a85;padding:8px 10px;background:#fff7f7;white-space:pre-wrap;text-align:justify">${_cpEsc(p.problems).replace(/\n/g,'<br>')}</div></div>` : ''}
    ${p.solutions ? `<div style="margin-bottom:10px"><div style="font-weight:700;font-size:11px;margin-bottom:4px">แนวทางแก้ไข / ข้อเสนอแนะ</div><div style="border:1px solid #5a6a85;padding:8px 10px;background:#f3fbf6;white-space:pre-wrap;text-align:justify">${_cpEsc(p.solutions).replace(/\n/g,'<br>')}</div></div>` : ''}
    ${imagesBlock}
  </div>`;
}

// รวมทุกส่วนแล้วเปิดหน้าต่างพิมพ์ — ผู้ใช้กด "บันทึกเป็น PDF" ในกล่องพิมพ์ของเบราว์เซอร์เอง
async function exportCommitteePDF(comKey) {
  const committee = [...COM_LIST, COM_UNASSIGNED].find(c => c.key === comKey) || COM_UNASSIGNED;
  const fp = projects.filter(p => {
    const coms = _getCommittees(p);
    return coms.length ? coms.includes(comKey) : comKey === COM_UNASSIGNED.key;
  });
  if (!fp.length) {
    showToast(`ยังไม่มีโครงการในอนุกรรมการ${committee.label}`);
    return;
  }
  const year = 2569;

  // เปิดหน้าต่างใหม่ก่อนมี await/การประมวลผลใดๆ กัน browser บล็อก popup เพราะไม่ถือเป็น user-gesture ทันที
  const printWin = window.open('', '_blank');
  if (!printWin) {
    alert('เบราว์เซอร์บล็อกป๊อปอัปสำหรับหน้าต่างพิมพ์ PDF กรุณาอนุญาต popup ของเว็บนี้แล้วลองใหม่อีกครั้ง');
    return;
  }

  let body = _buildCommitteeCoverPageHTML_69(year, committee);
  body += _buildCommitteeSummaryPageHTML_69(fp, year, committee);
  body += fp.map((p,i) => _buildProjectDetailPageHTML_69(p, year, i === fp.length-1)).join('');

  const safeLabel = (committee.label||'').replace(/[\/\\:*?"<>|]/g,'').substring(0,40);
  const docHtml = `<!DOCTYPE html>
<html lang="th"><head><meta charset="UTF-8">
<title>รายงานอนุกรรมการ_${safeLabel}_${year}</title>
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 12mm 16mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin:0; padding:0; background:#fff; font-family:'Sarabun',sans-serif; color:#161c26; }
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .pdf-toolbar { position:sticky; top:0; z-index:10; background:#1e2f4f; color:#fff; padding:10px 16px;
    display:flex; align-items:center; justify-content:space-between; font-size:13px; font-family:'Sarabun',sans-serif; }
  .pdf-toolbar button { font-family:'Sarabun',sans-serif; font-size:13px; font-weight:600; padding:7px 16px;
    border:none; border-radius:6px; background:#dc2626; color:#fff; cursor:pointer; }
  @media print { .pdf-toolbar { display:none; } }
</style>
</head><body>
  <div class="pdf-toolbar">
    <span>ตัวอย่างก่อนพิมพ์ — กด "บันทึกเป็น PDF" ในหน้าต่างพิมพ์ของเบราว์เซอร์</span>
    <button onclick="window.print()">🖨️ พิมพ์ / บันทึกเป็น PDF</button>
  </div>
  ${body}
  <script>setTimeout(()=>window.print(), 400);<\/script>
</body></html>`;

  printWin.document.open();
  printWin.document.write(docHtml);
  printWin.document.close();
}

function renderCommitteeSection(fp) {
  const qEl = document.getElementById('committeeQuarterLabel');
  if (qEl) qEl.textContent = Q_LABEL[currentQuarter] + ' · ปีงบประมาณ พ.ศ. 2569';

  const map = _comStats(fp);
  // สัดส่วนงบเทียบเฉพาะ 4 ยุทธศาสตร์ (ไม่รวมงบบริหารสำนักงาน strategy 5)
  const totalBudget = fp.filter(p => String(p.strategy) !== '5').reduce((a, p) => a + (p.budget || 0), 0);

  // ── Metric cards ──
  const metricsEl = document.getElementById('committeeMetrics');
  if (metricsEl) {
    metricsEl.innerHTML = COM_LIST.map(c => {
      const d = map[c.key];
      const pct = d.budget > 0 ? Math.round((d.spent + d.po) / d.budget * 100) : 0;
      const remaining = d.budget - d.spent - d.po;
      const barColor = pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--amber)' : c.color;
      return `
        <div class="metric-card" style="background:linear-gradient(135deg,${c.colorLight},${c.colorLight});border-color:${c.color}33;position:relative;overflow:hidden;cursor:pointer;transition:transform .15s,box-shadow .15s" onclick="filterByCommittee('${c.key}')" title="ดูโครงการของอนุกรรมการนี้" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px ${c.color}22'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
          <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${c.color};border-radius:4px 0 0 4px"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div style="display:flex;align-items:center;gap:7px">
              <span style="font-size:18px">${c.icon}</span>
              <span style="font-size:10.5px;font-weight:700;color:${c.color};line-height:1.3">อนุกรรมการ<br>${c.label}</span>
            </div>
            <button onclick="event.stopPropagation();exportCommitteePDF('${c.key}')" title="Export PDF รายงานอนุกรรมการ${c.label} (รูปเล่มฉบับสมบูรณ์)"
              style="border:none;background:rgba(255,255,255,.65);color:${c.color};width:22px;height:22px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;transition:background .15s"
              onmouseover="this.style.background='#fff'" onmouseout="this.style.background='rgba(255,255,255,.65)'">📄</button>
          </div>
          <div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px">งบอนุมัติ</div>
          <div style="font-size:20px;font-weight:800;color:${c.color};line-height:1.1;margin-bottom:3px">${fmt(d.budget)}</div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px">${d.projects.length} โครงการ · คงเหลือ <strong style="color:${remaining < 0 ? 'var(--red)' : 'var(--green)'}">${fmt(remaining)}</strong></div>
          <div style="height:4px;background:var(--surface2);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${Math.min(pct, 100)}%;background:${barColor};border-radius:99px;transition:width .5s"></div>
          </div>
          <div style="font-size:10px;color:var(--text3);margin-top:3px">ใช้+PO: ${pct}%</div>
        </div>`;
    }).join('');
  }

  // ── Detail table ──
  const tbody = document.getElementById('committeeTableBody');
  if (!tbody) return;

  const allComs = [...COM_LIST, COM_UNASSIGNED];
  const rows = allComs.map((c, idx) => {
    const d = map[c.key];
    if (d.projects.length === 0 && c.key === COM_UNASSIGNED.key) return ''; // ซ่อนถ้าไม่มี
    const remaining = d.budget - d.spent - d.po;
    const pct = d.budget > 0 ? Math.round((d.spent + d.po) / d.budget * 100) : 0;
    const barColor = pct >= 90 ? '#dc2626' : pct >= 70 ? '#d97706' : c.color;
    const budgetShare = totalBudget > 0 ? Math.round(d.budget / totalBudget * 100) : 0;
    return `<tr class="data-row" style="cursor:pointer" onclick="filterByCommittee('${c.key}')" title="คลิกเพื่อดูโครงการของอนุกรรมการนี้">
      <td>
        <div style="display:flex;align-items:center;gap:7px">
          <span style="font-size:15px">${c.icon}</span>
          <div>
            <div style="font-weight:700;font-size:12px;color:${c.color}">${c.label}</div>
            <div style="font-size:10px;color:var(--text3)">สัดส่วนงบ ${budgetShare}% ของภาพรวม</div>
          </div>
        </div>
      </td>
      <td style="text-align:center">${d.projects.length}</td>
      <td class="td-num">${fmtFull(Math.round(d.budget))}</td>
      <td class="td-num">${fmtFull(Math.round(d.spent))}</td>
      <td class="td-num">${fmtFull(Math.round(d.po))}</td>
      <td class="td-num" style="${remaining < 0 ? 'color:var(--red)' : ''}">${fmtFull(Math.round(remaining))}</td>
      <td>
        <div style="display:flex;align-items:center;gap:7px">
          <div style="flex:1;height:5px;background:var(--surface2);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${Math.min(pct, 100)}%;background:${barColor};border-radius:99px;transition:width .5s"></div>
          </div>
          <span style="font-size:11px;color:var(--text2);min-width:32px;text-align:right">${pct}%</span>
        </div>
      </td>
      <td style="text-align:center;font-size:12px">
        <span style="color:var(--green);margin-right:3px">✅${d.done}</span>
        <span style="color:var(--accent);margin-right:3px">⏳${d.progress}</span>
        <span style="color:var(--text3)">○${d.pending}</span>
      </td>
    </tr>`;
  }).filter(Boolean);

  // Total row — ไม่รวมงบบริหารสำนักงาน (strategy 5)
  const strategyFp = fp.filter(p => String(p.strategy) !== '5');
  const totBudget  = allComs.reduce((a, c) => a + map[c.key].budget, 0);
  const totSpent   = allComs.reduce((a, c) => a + map[c.key].spent, 0);
  const totPo      = allComs.reduce((a, c) => a + map[c.key].po, 0);
  const totRem     = totBudget - totSpent - totPo;
  const totPct     = totBudget > 0 ? Math.round((totSpent + totPo) / totBudget * 100) : 0;
  const totProj    = strategyFp.length;
  rows.push(`<tr style="background:var(--surface2);font-weight:700">
    <td>รวมทั้งหมด (${COM_LIST.length} อนุกรรมการ)</td>
    <td style="text-align:center">${totProj}</td>
    <td class="td-num">${fmtFull(Math.round(totBudget))}</td>
    <td class="td-num">${fmtFull(Math.round(totSpent))}</td>
    <td class="td-num">${fmtFull(Math.round(totPo))}</td>
    <td class="td-num" style="${totRem < 0 ? 'color:var(--red)' : ''}">${fmtFull(Math.round(totRem))}</td>
    <td>
      <div style="display:flex;align-items:center;gap:7px">
        <div style="flex:1;height:5px;background:var(--border2);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.min(totPct, 100)}%;background:var(--accent);border-radius:99px"></div>
        </div>
        <span style="font-size:11px;color:var(--text2);min-width:32px;text-align:right">${totPct}%</span>
      </div>
    </td>
    <td style="text-align:center;font-size:12px">
      <span style="color:var(--green);margin-right:3px">✅${strategyFp.filter(p=>p.status==='done').length}</span>
      <span style="color:var(--accent);margin-right:3px">⏳${strategyFp.filter(p=>p.status==='progress').length}</span>
      <span style="color:var(--text3)">○${strategyFp.filter(p=>p.status==='pending').length}</span>
    </td>
  </tr>`);

  tbody.innerHTML = rows.join('');
}

function renderCommitteeChart(fp) {
  const map = _comStats(fp);
  const chartFont = { family: "'Sarabun', sans-serif", size: 11 };

  // destroy & recreate canvas
  const old = document.getElementById('chartCommitteeBudget');
  if (!old) return;
  const clone = document.createElement('canvas');
  clone.id = 'chartCommitteeBudget';
  old.parentNode.replaceChild(clone, old);

  const labels  = COM_LIST.map(c => c.label.replace('ด้าน', ''));
  const budgets = COM_LIST.map(c => Math.round(map[c.key].budget));
  const spents  = COM_LIST.map(c => Math.round(map[c.key].spent));
  const pos     = COM_LIST.map(c => Math.round(map[c.key].po));
  const rems    = COM_LIST.map((c, i) => Math.max(budgets[i] - spents[i] - pos[i], 0));
  const colors  = COM_LIST.map(c => c.color);

  chartCommitteeBudget = new Chart(clone, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'ใช้ไปแล้ว',
          data: spents,
          backgroundColor: colors.map(c => c + 'cc'),
          borderColor: colors,
          borderWidth: 0,
          borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
          borderSkipped: false
        },
        {
          label: 'PO ผูกพัน',
          data: pos,
          backgroundColor: ['#d97706cc', '#d97706cc', '#d97706cc', '#d97706cc'],
          borderWidth: 0,
          borderRadius: 0,
          borderSkipped: false
        },
        {
          label: 'คงเหลือ',
          data: rems,
          backgroundColor: ['#e2e8f0bb', '#e2e8f0bb', '#e2e8f0bb', '#e2e8f0bb'],
          borderWidth: 0,
          borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(28,35,51,.92)',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('th-TH')} บาท`
          },
          bodyFont: chartFont,
          titleFont: { ...chartFont, weight: '700' }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { family: "'Sarabun', sans-serif", size: 10 }, color: '#5a6477', maxRotation: 0 },
          border: { display: false }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,.04)' },
          border: { display: false },
          ticks: {
            font: chartFont,
            color: '#9aa3b2',
            callback: v => v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v
          }
        }
      },
      animation: { duration: 600 }
    }
  });

  // Legend
  const leg = document.getElementById('chartCommitteeLegend');
  if (leg) {
    leg.innerHTML = [
      ['', 'งบอนุมัติแยกตามอนุกรรมการ', ''],
      ...COM_LIST.map((c, i) => [c.color, c.label.replace('ด้าน', ''), fmtFull(budgets[i]) + ' บาท'])
    ].slice(1).map(([color, label, val]) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
        <div style="display:flex;align-items:center;gap:5px">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>
          <span style="font-size:11px;color:var(--text2)">${label}</span>
        </div>
        <span style="font-weight:700;font-size:12px;color:var(--text)">${val}</span>
      </div>`).join('');
  }
}

// ===== GOOGLE SHEETS =====

// *** ใส่ URL ของ Google Apps Script Web App ที่นี่ ***
// ⚠️ สำคัญ: เปลี่ยน URL ด้านล่างนี้ให้เป็น URL ของคุณเองที่ได้จากการ Deploy Google Apps Script
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxTHU_e9LQiUulANvK6Dd0ziTJy66Aa_1Z9-OgZypwaSzXRGVnNo1lRJZsCjOqj0A7Scw/exec';
let _gasUrl = GAS_URL;
let GAS_ENABLED = true;

// ── gasPost: ส่งผ่าน GET parameter เพื่อหลีกเลี่ยงปัญหา CORS/redirect ──
// GAS Web App จาก browser ภายนอก: POST body มักหายระหว่าง redirect
// วิธีที่เสถียรที่สุดคือส่งทุกอย่างผ่าน GET query string
// ── gasJsonp: เรียก GAS ด้วย JSONP (ใช้สำหรับ getAll เท่านั้น) ──────
function gasJsonp(params){
  return new Promise((resolve, reject) => {
    const cbName = '_gasCb_' + Date.now() + '_' + Math.floor(Math.random()*10000);
    const timeout = setTimeout(() => {
      delete window[cbName];
      if(script.parentNode) script.remove();
      reject(new Error('GAS timeout'));
    }, 30000);

    window[cbName] = function(data){
      clearTimeout(timeout);
      delete window[cbName];
      if(script.parentNode) script.remove();
      resolve(data);
    };

    const p = new URLSearchParams({ ...params, callback: cbName });
    const script = document.createElement('script');
    script.src = _gasUrl + '?' + p.toString();
    script.onerror = () => {
      clearTimeout(timeout);
      delete window[cbName];
      if(script.parentNode) script.remove();
      reject(new Error('Script load error'));
    };
    document.head.appendChild(script);
  });
}

// ── gasPost: ส่งข้อมูลขึ้น GAS ด้วย no-cors fetch (ไม่มี URL limit) ──────
// GAS Web App รองรับ POST แต่ browser จะไม่ได้รับ response body เมื่อใช้ no-cors
// จึงถือว่าสำเร็จถ้า fetch ไม่ throw error
function gasPost(action, payload){
  const body = JSON.stringify({ action, ...payload });
  return fetch(_gasUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body
  })
  .then(() => ({ success: true }))
  .catch(err => { throw new Error(err.message); });
}

// ── cloudinaryUpload: อัปโหลดตรงจาก browser → Cloudinary ──────
// ไม่ผ่าน GAS เลย → เร็วกว่าเดิมมาก ไม่มีปัญหา chunk/JSONP
const CLOUDINARY_CLOUD  = 'deyqenuv3';
const CLOUDINARY_PRESET = 'DLFProject';

async function cloudinaryUpload(dataUrl, fileName){
  const formData = new FormData();
  formData.append('file', dataUrl);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('public_id', fileName.replace(/[^a-zA-Z0-9_-]/g, '_') + '_' + Date.now());

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD + '/image/upload',
    { method: 'POST', body: formData }
  );
  if(!res.ok) throw new Error('Cloudinary HTTP ' + res.status);
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  return { url: data.secure_url, publicId: data.public_id };
}

function applyGasUrl(){
  const val = document.getElementById('gasUrlInput').value.trim();
  if(!val || !val.startsWith('https://script.google.com')){
    document.getElementById('gasUrlStatus').innerHTML='<span style="color:var(--red)">❌ URL ไม่ถูกต้อง ต้องขึ้นต้นด้วย https://script.google.com</span>';
    return;
  }
  _gasUrl = val;
  GAS_ENABLED = true;
  localStorage.setItem('gasUrl', val);
  document.getElementById('gasUrlStatus').innerHTML='<span style="color:var(--green)">✅ ตั้งค่าสำเร็จ — การเปลี่ยนแปลงทุกครั้งจะ Sync ขึ้น Sheet อัตโนมัติ</span>';
}

function _initGasUI(){
  const saved = localStorage.getItem('gasUrl');
  if(saved){
    const el = document.getElementById('gasUrlInput');
    if(el) el.value = saved;
    const st = document.getElementById('gasUrlStatus');
    if(st) st.innerHTML='<span style="color:var(--green)">✅ ใช้ URL ที่บันทึกไว้ — พร้อม Sync</span>';
    _gasUrl = saved; GAS_ENABLED = true;
  }
}

// ═══════════════════════════════════════════════════════
// RISK ↔ GOOGLE SHEET SYNC
// ═══════════════════════════════════════════════════════

// ── Sync ความเสี่ยงทั้งหมดขึ้น Sheet (เขียนทับ) ──
async function syncRisksToSheet() {
  const statusEl = document.getElementById('rmGsStatus');
  const setStatus = (html, cls) => { if(statusEl){ statusEl.className='status-msg '+(cls||'status-info'); statusEl.innerHTML=html; } };
  if (!_gasReady()) { setStatus('⚠️ ยังไม่ได้ตั้งค่า GAS URL — ไปที่หน้า "Google Sheets" เพื่อตั้งค่าก่อน', 'status-err'); return; }
  if (!risks.length) { setStatus('ℹ️ ยังไม่มีข้อมูลความเสี่ยงให้ Sync', 'status-info'); return; }
  setStatus('⏳ กำลัง Sync ความเสี่ยง '+risks.length+' รายการขึ้น Google Sheet...', 'status-info');
  try {
    // ส่งผ่าน POST (no-cors) — bulkSaveRisks เขียนทับทั้ง Sheet
    await gasPost('bulkSaveRisks', { data: JSON.stringify(risks) });
    setStatus('✅ Sync ความเสี่ยงสำเร็จ! ('+risks.length+' รายการ) — ตรวจสอบที่ Sheet "Risks"', 'status-ok');
    showToast('☁ Sync ความเสี่ยงขึ้น Sheet แล้ว');
  } catch(err) {
    setStatus('❌ Sync ไม่สำเร็จ: '+err.message, 'status-err');
  }
}

// ── โหลดความเสี่ยงจาก Sheet ──
async function loadRisksFromSheet() {
  const statusEl = document.getElementById('rmGsStatus');
  const setStatus = (html, cls) => { if(statusEl){ statusEl.className='status-msg '+(cls||'status-info'); statusEl.innerHTML=html; } };
  if (!_gasReady()) { setStatus('⚠️ ยังไม่ได้ตั้งค่า GAS URL — ไปที่หน้า "Google Sheets" เพื่อตั้งค่าก่อน', 'status-err'); return; }
  setStatus('⏳ กำลังโหลดความเสี่ยงจาก Google Sheet...', 'status-info');
  try {
    const res = await gasJsonp({ action: 'getAllRisks' });
    if (res && res.success && Array.isArray(res.data)) {
      risks = res.data;
      saveRisksToLocal();
      renderRiskTable();
      setStatus('✅ โหลดความเสี่ยง '+risks.length+' รายการจาก Sheet สำเร็จ', 'status-ok');
      showToast('⬇ โหลดความเสี่ยงจาก Sheet แล้ว ('+risks.length+' รายการ)');
    } else {
      setStatus('ℹ️ ยังไม่มีข้อมูลความเสี่ยงใน Sheet (หรือ Sheet "Risks" ยังไม่ถูกสร้าง)', 'status-info');
    }
  } catch(err) {
    setStatus('❌ โหลดไม่สำเร็จ: '+err.message, 'status-err');
  }
}

// ── Auto-sync ความเสี่ยงรายตัว (เรียกหลัง save/delete) ──
function _autoSyncRisk(action, payload) {
  if (!_gasReady()) return;
  try {
    gasPost(action, payload).catch(()=>{});
  } catch(e) {}
}

// ── Export ความเสี่ยงเป็น CSV ──
function exportRisksCSV() {
  if (!risks.length) { showToast('ℹ️ ยังไม่มีข้อมูลความเสี่ยง'); return; }
  const headers = ['id','project','name','category','strategy','likelihood','impact','score','level','status','residual','control','contingency','dueDate','reviewDate','owner','quarter','note'];
  const rows = risks.map(r => {
    const score = r.likelihood * r.impact;
    return [r.id, r.project||'', r.name||'', r.category||'', r.strategy||'',
            r.likelihood, r.impact, score, getRiskLevel(score).key, r.status||'',
            r.residual||'', r.control||'', r.contingency||'', r.dueDate||'',
            r.reviewDate||'', r.owner||'', r.quarter||'', r.note||''];
  });
  const csv = [headers, ...rows].map(row =>
    row.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')
  ).join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'risks_2569_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click(); URL.revokeObjectURL(url);
  showToast('⬇ ดาวน์โหลด CSV ความเสี่ยงแล้ว');
}

// ── คัดลอกโค้ด GAS สำหรับ Risk Sheet ──
function copyRiskGASTemplate() {
  const tpl = RISK_GAS_CODE;
  navigator.clipboard.writeText(tpl).then(() => {
    const st = document.getElementById('riskGasCopyStatus');
    if (st) { st.textContent = '✅ คัดลอกโค้ด Risk GAS แล้ว — นำไปวางต่อท้าย Code.gs เดิม แล้ว Deploy ใหม่'; setTimeout(()=>st.textContent='',5000); }
    showToast('📋 คัดลอกโค้ด Risk GAS แล้ว');
  }).catch(() => showToast('❌ คัดลอกไม่สำเร็จ'));
}

// ── เปิด/ปิด กล่องช่วยเหลือ GAS + แสดงโค้ด ──
function toggleRiskGasHelp() {
  const box = document.getElementById('riskGasHelp');
  if (!box) return;
  const open = box.style.display === 'none';
  box.style.display = open ? 'block' : 'none';
  if (open) {
    const codeEl = document.getElementById('riskGasCodeBlock');
    if (codeEl && !codeEl.textContent) codeEl.textContent = RISK_GAS_CODE;
    box.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
}

function copyGASTemplate(){
  const tpl = `// ===== Google Apps Script สำหรับ DLTV Report =====
// รองรับ: Projects Sheet + Users Sheet (Auth)
// Deploy: Execute as Me | Who has access: Anyone

function doGet(e) {
  const action = e.parameter.action;
  const cb     = e.parameter.callback; // JSONP callback
  let result;

  try {
    if (action === 'getAll')            result = getAll();
    else if (action === 'loginUser')    result = loginUser(e.parameter);
    else if (action === 'registerUser') result = registerUser(e.parameter);
    else if (action === 'resetPassword')   result = resetPassword(e.parameter);
    else if (action === 'changePassword')  result = changePassword(e.parameter);
    else result = { success: false, message: 'Unknown GET action: ' + action };
  } catch (err) {
    result = { success: false, message: 'Error: ' + err.message };
  }

  const json = JSON.stringify(result);
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    if (action === 'save')     return ok(saveProject(payload.data));
    if (action === 'update')   return ok(saveProject(payload.data));
    if (action === 'delete')   return ok(deleteProject(payload.id));
    if (action === 'bulkSave') return ok(bulkSave(payload.data));
    return ok({ success: false, message: 'Unknown action' });
  } catch(err) {
    return ok({ success: false, message: err.message });
  }
}

// ── Projects Sheet ──────────────────────────────────────────
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('Projects') || ss.getSheets()[0];
}

function getUserSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Users');
  if (!sheet) {
    sheet = ss.insertSheet('Users');
    // เพิ่มคอลัมน์ tempPasswordHash (คอลัมน์ที่ 5) เพื่อรองรับการลืมรหัสผ่าน
    sheet.appendRow(['id', 'name', 'email', 'passwordHash', 'tempPasswordHash', 'createdAt']);
    sheet.getRange(1, 1, 1, 6)
      .setBackground('#059669').setFontColor('#ffffff').setFontWeight('bold');
  }
  return sheet;
}

function getHeaders() {
  return ['id','name','strategy','budget','spent','po','status',
          'result','kpi','problems','solutions','quarter',
          'owner','committees','image_count','images_json',
          'lastEditedBy','lastEditedByPosition','lastEditedAt'];
}

function ensureHeaders() {
  const sheet = getSheet();
  const headers = getHeaders();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1,1,1,headers.length)
      .setBackground('#3b72f0').setFontColor('#ffffff').setFontWeight('bold');
    return;
  }
  // Migration: sheets created before lastEditedBy/lastEditedByPosition/lastEditedAt
  // existed are missing trailing columns — add them so old sheets stay compatible.
  const lastCol = sheet.getLastColumn();
  const existing = sheet.getRange(1,1,1,lastCol).getValues()[0];
  if (existing.length < headers.length) {
    const missing = headers.slice(existing.length);
    const range = sheet.getRange(1, existing.length+1, 1, missing.length);
    range.setValues([missing]);
    range.setBackground('#3b72f0').setFontColor('#ffffff').setFontWeight('bold');
  }
}

function rowToObj(row) {
  const h = getHeaders(); const obj = {};
  h.forEach((k,i) => obj[k] = row[i]);
  obj.budget = Number(obj.budget)||0;
  obj.spent  = Number(obj.spent)||0;
  obj.po     = Number(obj.po)||0;
  obj.kpi    = obj.kpi ? String(obj.kpi).split('|').filter(Boolean) : [];
  obj.owner  = obj.owner || '';
  try { obj.committees = obj.committees ? JSON.parse(obj.committees) : []; } catch(e){ obj.committees=[]; }
  try { obj.images = obj.images_json ? JSON.parse(obj.images_json) : []; } catch(e){ obj.images=[]; }
  delete obj.images_json; delete obj.image_count;
  obj.lastEditedBy = obj.lastEditedBy || '';
  obj.lastEditedByPosition = obj.lastEditedByPosition || '';
  obj.lastEditedAt = obj.lastEditedAt || '';
  return obj;
}

function objToRow(d) {
  const images = d.images || [];
  return [d.id, d.name, d.strategy, d.budget||0, d.spent||0, d.po||0,
          d.status, d.result||'', (d.kpi||[]).join('|'),
          d.problems||'', d.solutions||'', d.quarter||'all', d.owner||'',
          JSON.stringify(d.committees||[]), images.length,
          JSON.stringify(images.map(i=>({name:i.name,dataUrl:i.dataUrl}))),
          d.lastEditedBy||'', d.lastEditedByPosition||'', d.lastEditedAt||''];
}

function getAll() {
  ensureHeaders();
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { success: true, data: [] };
  return { success: true, data: rows.slice(1).map(rowToObj) };
}

function saveProject(d) {
  ensureHeaders();
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  let rowIdx  = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(d.id)) { rowIdx = i + 1; break; }
  }
  const row = objToRow(d);
  if (rowIdx > 0) sheet.getRange(rowIdx, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  return { success: true };
}

function deleteProject(id) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === String(id)) { sheet.deleteRow(i + 1); break; }
  }
  return { success: true };
}

function bulkSave(data) {
  ensureHeaders();
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
  if (data && data.length) {
    const rows = data.map(objToRow);
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
  return { success: true, count: data ? data.length : 0 };
}

// ── Users Auth ──────────────────────────────────────────────
function registerUser(params) {
  const sheet = getUserSheet();
  const rows  = sheet.getDataRange().getValues();
  const email = (params.email || '').toLowerCase().trim();

  // ตรวจสอบซ้ำ
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === email) {
      return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
    }
  }

  const id = 'u_' + Date.now();
  // บันทึกข้อมูล 6 คอลัมน์ให้ตรงกับ Header (id, name, email, passwordHash, tempPasswordHash, createdAt)
  sheet.appendRow([id, params.name, email, params.passwordHash, '', params.createdAt || new Date().toISOString()]);
  return { success: true, user: { id, name: params.name, email } };
}

function loginUser(params) {
  const sheet = getUserSheet();
  const rows  = sheet.getDataRange().getValues();
  const email = (params.email || '').toLowerCase().trim();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === email &&
        String(rows[i][3]) === String(params.passwordHash)) {
      return { success: true, user: { id: rows[i][0], name: rows[i][1], email: rows[i][2] } };
    }
  }
  return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
}

function resetPassword(params) {
  const sheet = getUserSheet();
  const rows  = sheet.getDataRange().getValues();
  const email = (params.email || '').toLowerCase().trim();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === email) {
      const tmp = 'tmp' + Math.floor(100000 + Math.random() * 900000);
      // เก็บ tempPasswordHash ใน col 5 (index 4, 0-based)
      // Users sheet: id | name | email | passwordHash | tempPasswordHash | createdAt
      // ถ้า sheet มีแค่ 5 col ให้ append; ถ้ามี 6+ ให้ set
      const lastCol = rows[i].length;
      sheet.getRange(i + 1, 5, 1, 1).setValue(hashSimpleGAS(tmp));
      return { success: true, tempPassword: tmp };
    }
  }
  return { success: false, message: 'ไม่พบอีเมลนี้ในระบบ' };
}

function changePassword(params) {
  const sheet = getUserSheet();
  const rows  = sheet.getDataRange().getValues();
  const email = (params.email || '').toLowerCase().trim();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === email) {
      const storedTemp = String(rows[i][4] || '');
      if (storedTemp !== String(params.tempPasswordHash)) {
        return { success: false, message: 'รหัสชั่วคราวไม่ถูกต้อง' };
      }
      sheet.getRange(i + 1, 4, 1, 1).setValue(params.newPasswordHash);
      sheet.getRange(i + 1, 5, 1, 1).setValue(''); // ล้าง temp
      return { success: true };
    }
  }
  return { success: false, message: 'ไม่พบอีเมล' };
}

function hashSimpleGAS(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (Math.imul ? Math.imul(31, h) : (31 * h) | 0) + str.charCodeAt(i) | 0; }
  return 'h' + Math.abs(h).toString(16);
}

// ── Helper ──────────────────────────────────────────────────
function ok(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`;
  navigator.clipboard.writeText(tpl).then(()=>{
    document.getElementById('gasTemplateCopyStatus').textContent = '✅ คัดลอก GAS Template สำเร็จ (รองรับ Projects + Users Auth)';
    setTimeout(()=>{ document.getElementById('gasTemplateCopyStatus').textContent=''; }, 4000);
  }).catch(()=>{
    document.getElementById('gasTemplateCopyStatus').textContent = '❌ ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกโค้ดด้านบนด้วยตนเอง';
  });
}

function loadFromSheet(){
  if(!confirm('⚠️ การโหลดจาก Sheet จะแทนที่ข้อมูลปัจจุบันในหน้าเว็บทั้งหมด\nยืนยันหรือไม่?')) return;
  const statusEl=document.getElementById('gsStatus');
  statusEl && (statusEl.innerHTML='<div class="status-msg status-info">⏳ กำลังโหลดข้อมูลจาก Google Sheet...</div>');
  fetch(`${_gasUrl}?action=getAll`, { redirect: 'follow' })
    .then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(res=>{
      if(!res.success) throw new Error(res.message);
      projects=res.data;
      statusEl && (statusEl.innerHTML=`<div class="status-msg status-ok">✅ โหลดสำเร็จ ${projects.length} โครงการ (จาก Google Sheet)</div>`);
      saveToLocal(true); renderTable(); updateDashboard();
    })
    .catch(e=>{
      statusEl && (statusEl.innerHTML=`<div class="status-msg status-err">❌ โหลดไม่สำเร็จ: ${e.message}</div>`);
    });
}

function syncAllToSheet(){
  const statusEl=document.getElementById('gsStatus');
  statusEl && (statusEl.innerHTML='<div class="status-msg status-info">⏳ กำลัง Sync ข้อมูลทั้งหมดขึ้น Google Sheet...</div>');
  // ส่งทีละโครงการ (upsert) แทน bulkSave เพื่อหลีกเลี่ยงปัญหา payload ใหญ่เกินไป
  const tasks = projects.map(p => gasPost('update', { data: p }));
  Promise.all(tasks)
    .then(()=>{
      statusEl && (statusEl.innerHTML=`<div class="status-msg status-ok">✅ Sync สำเร็จ ${projects.length} โครงการขึ้น Google Sheet แล้ว</div>`);
    })
    .catch(e=>{ statusEl && (statusEl.innerHTML=`<div class="status-msg status-err">❌ ${e.message}</div>`); });
}

function exportCSV(){
  const headers=['id','name','strategy','budget','spent','po','status','result','kpi','problems','solutions','quarter','image_count'];
  const rows=[headers,...projects.map(p=>[
    p.id,'"'+(p.name||'').replace(/"/g,'""')+'"',
    p.strategy,p.budget||0,p.spent||0,p.po||0,p.status,
    '"'+(p.result||'').replace(/"/g,'""')+'"',
    '"'+(p.kpi||[]).join('|').replace(/"/g,'""')+'"',
    '"'+(p.problems||'').replace(/"/g,'""')+'"',
    '"'+(p.solutions||'').replace(/"/g,'""')+'"',
    p.quarter||'all',
    (p.images||[]).length
  ])];
  const csv=rows.map(r=>r.join(',')).join('\n');
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='รายงานผลดำเนินงาน_DLTV_2569.csv';
  a.click();
  document.getElementById('gsStatus').innerHTML='<div class="status-msg status-ok">✅ ดาวน์โหลด CSV สำเร็จ (รูปภาพถูกส่งใน JSON แยกต่างหาก)</div>';
}

// ===== PDF EXPORT =====
let _pdfOptSelected = 1;

function openPdfModal() {
  document.getElementById('pdfQuarterSel').value = currentQuarter;
  document.getElementById('pdfModalOverlay').classList.add('open');
  document.getElementById('pdfProgress').classList.remove('show');
  const btn = document.getElementById('pdfGenBtn');
  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> สร้าง PDF';
}
function closePdfModal() {
  document.getElementById('pdfModalOverlay').classList.remove('open');
}
function selectPdfOpt(n) {
  _pdfOptSelected = n;
  [1,2,3].forEach(i => document.getElementById('pdfOpt'+i).classList.toggle('selected', i===n));
}
function _pdfProgress(txt, pct) {
  document.getElementById('pdfProgressText').textContent = txt;
  document.getElementById('pdfProgressBar').style.width = pct+'%';
}

/* ─── helpers ─── */
function _fmtB(n){ n=n||0; if(n>=1000000) return (n/1000000).toFixed(2)+'M'; if(n>=1000) return (n/1000).toFixed(0)+'K'; return n.toLocaleString('th-TH'); }
function _fmtFull(n){ return (n||0).toLocaleString('th-TH'); }

const _S_NAMES = {1:'ยุทธศาสตร์ที่ 1',2:'ยุทธศาสตร์ที่ 2',3:'ยุทธศาสตร์ที่ 3',4:'ยุทธศาสตร์ที่ 4',5:'งบบริหารสำนักงาน'};
const _S_FULL  = {1:'การพัฒนาการจัดการศึกษาทางไกล',2:'การพัฒนาครูและโรงเรียนต้นทาง',3:'การพัฒนาครูและโรงเรียนปลายทาง',4:'การพัฒนาระบบการบริหารจัดการ',5:'งบดำเนินการสำนักงาน'};
/* โทนสีแบบทางการ (semi-formal) — ลดความจัดของสี ใช้โทนเข้ม/หม่นคล้ายเอกสารราชการ แต่ยังแยกยุทธศาสตร์ได้ */
const _S_COLOR = {1:'#2c4a72',2:'#3a6b4c',3:'#8a5a1f',4:'#5c4a78',5:'#2c6870'};
const _S_LIGHT = {1:'#eef1f6',2:'#eef4ef',3:'#f8f2e8',4:'#f2eef6',5:'#eef4f5'};
const _STATUS_TH = {done:'แล้วเสร็จ',progress:'กำลังดำเนิน',pending:'ยังไม่เริ่ม'};
const _STATUS_COLOR = {done:'#3a6b4c',progress:'#2c4a72',pending:'#6b7280'};
const _STATUS_BG    = {done:'#eef4ef',progress:'#eef1f6',pending:'#f3f4f6'};
const _Q_LABELS = {all:'ทุกไตรมาส','1':'ไตรมาส 1 (ต.ค.–ธ.ค. 68)','2':'ไตรมาส 2 (ม.ค.–มี.ค. 69)','3':'ไตรมาส 3 (เม.ย.–มิ.ย. 69)','4':'ไตรมาส 4 (ก.ค.–ก.ย. 69)'};

/* ─── ข้อมูลทางการสำหรับรายงาน (letterhead / เลขที่เอกสาร / ลงนาม) ─── */
const _ORG_NAME_TH   = 'มูลนิธิการศึกษาทางไกลผ่านดาวเทียม ในพระบรมราชูปถัมภ์';
const _ORG_LOGO_URL  = 'https://dltv.ac.th/upload/data/users/0/316/CMS/images/logo%20dlf%20%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C.png';
const _INK       = '#1c2333';   // สีตัวอักษรหลัก (ดำอมกรมท่า)
const _INK_SOFT  = '#4b5563';   // สีตัวอักษรรอง
const _RULE      = '#c9ced8';   // สีเส้นคั่นแบบทางการ
const _NAVY      = '#1c2c4a';   // สีเน้นหลักของเอกสาร (กรมท่าเข้ม)

/* เลขที่เอกสารออกอัตโนมัติ เช่น ที่ มสษ. 245/2569 (245 อิงจากวันที่ของปี) */
function _genDocNumber(){
  const now = new Date();
  const start = new Date(now.getFullYear(),0,0);
  const dayOfYear = Math.floor((now-start)/86400000);
  return `ที่ มสษ. ${dayOfYear}/2569`;
}
function _thaiDateNow(){
  return new Date().toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'});
}

/* ─── หน้าปก (letterhead แบบกึ่งทางการ) ─── */
function _buildCoverHTML(typeLabel, qLabel, dateStr){
  return `
  <div style="font-family:'Sarabun',sans-serif;width:794px;height:1050px;background:#ffffff;color:${_INK};padding:0;position:relative;box-sizing:border-box">
    <div style="padding:36px 48px 0">
      <div style="display:flex;justify-content:flex-end;font-size:12px;color:${_INK_SOFT};margin-bottom:26px">
        <span>วันที่ออกรายงาน ${dateStr}</span>
      </div>
      <div style="text-align:center;padding-bottom:22px;border-bottom:2px solid ${_NAVY};margin-bottom:34px">
        <img src="${_ORG_LOGO_URL}" crossorigin="anonymous" style="height:74px;margin-bottom:12px" onerror="this.style.display='none'">
        <div style="font-size:16px;font-weight:700;color:${_NAVY}">${_ORG_NAME_TH}</div>
        <div style="font-size:12px;color:${_INK_SOFT};margin-top:2px">รายงานผลการดำเนินงานโครงการ ประจำปีงบประมาณ พ.ศ. 2569</div>
      </div>
    </div>
    <div style="text-align:center;padding:60px 60px 0">
      <div style="font-size:13px;letter-spacing:.08em;color:${_INK_SOFT};margin-bottom:10px">รายงาน</div>
      <div style="font-size:26px;font-weight:700;color:${_NAVY};line-height:1.5;margin-bottom:10px">
        รายงานสรุปผลการดำเนินงานโครงการ<br>ประจำปีงบประมาณ พ.ศ. 2569
      </div>
      <div style="font-size:15px;color:${_INK_SOFT};margin-bottom:4px">ฉบับ${typeLabel}</div>
      <div style="font-size:14px;color:${_INK_SOFT}">${qLabel}</div>
    </div>
    <div style="position:absolute;bottom:16px;left:0;right:0;padding:16px 48px 0;border-top:1px solid ${_RULE}">
      <div style="font-size:11px;color:${_INK_SOFT};text-align:center">เอกสารฉบับนี้จัดทำขึ้นเพื่อรายงานผลการดำเนินงานและการใช้จ่ายงบประมาณต่อคณะกรรมการและผู้บริหาร</div>
    </div>
  </div>`;
}

/* ─── สรุปผู้บริหาร (Executive Summary) ─── */
function _buildExecSummaryHTML(fp, qLabel){
  const totalB = fp.reduce((a,p)=>a+(p.budget||0),0);
  const totalS = fp.reduce((a,p)=>a+(p.spent||0),0);
  const totalPO= fp.reduce((a,p)=>a+(p.po||0),0);
  const totalR = totalB-totalS-totalPO;
  const done   = fp.filter(p=>p.status==='done').length;
  const prog   = fp.filter(p=>p.status==='progress').length;
  const pend   = fp.filter(p=>p.status==='pending').length;
  const spentPct = totalB>0?((totalS+totalPO)/totalB*100).toFixed(1):0;
  const doneStrategies = [1,2,3,4,5].map(s=>{
    const ps = fp.filter(p=>p.strategy==s);
    if(!ps.length) return null;
    const b = ps.reduce((a,p)=>a+(p.budget||0),0);
    const spent = ps.reduce((a,p)=>a+(p.spent||0)+(p.po||0),0);
    const pct = b>0?Math.round(spent/b*100):0;
    return `<li style="margin-bottom:5px">${_S_NAMES[s]} (${_S_FULL[s]}) ดำเนินการแล้ว <strong>${pct}%</strong> ของงบประมาณที่ได้รับ จากทั้งหมด ${ps.length} โครงการ</li>`;
  }).filter(Boolean).join('');

  return `
  <div style="font-family:'Sarabun',sans-serif;width:794px;background:#ffffff;color:${_INK};padding:40px 48px;line-height:1.85;box-sizing:border-box">
    <div style="font-size:18px;font-weight:700;color:${_NAVY};border-bottom:2px solid ${_NAVY};padding-bottom:10px;margin-bottom:18px">คำนำและสรุปผู้บริหาร (Executive Summary)</div>
    <p style="font-size:14px;text-align:justify;text-justify:inter-character;margin-bottom:14px">
      รายงานฉบับนี้จัดทำขึ้นเพื่อสรุปผลการดำเนินงานและสถานะการใช้จ่ายงบประมาณของโครงการภายใต้แผนยุทธศาสตร์
      ${_ORG_NAME_TH} ประจำปีงบประมาณ พ.ศ. 2569 ${qLabel !== 'ทุกไตรมาส' ? 'สำหรับ' + qLabel : 'สำหรับภาพรวมทั้งปีงบประมาณ'}
      โดยมีวัตถุประสงค์เพื่อนำเสนอความก้าวหน้าของการดำเนินงาน การใช้จ่ายงบประมาณ ตลอดจนปัญหาอุปสรรคและแนวทางแก้ไข
      ต่อคณะกรรมการและผู้บริหารเพื่อใช้ประกอบการพิจารณาและติดตามการดำเนินงานต่อไป
    </p>
    <p style="font-size:14px;text-align:justify;text-justify:inter-character;margin-bottom:16px">
      ในช่วงเวลาที่รายงาน มีโครงการทั้งสิ้น <strong>${fp.length}</strong> โครงการ ภายใต้งบประมาณที่ได้รับอนุมัติรวม
      <strong>${_fmtFull(totalB)} บาท</strong> มีการใช้จ่ายและก่อหนี้ผูกพัน (PO) รวม <strong>${_fmtFull(totalS+totalPO)} บาท</strong>
      คิดเป็นร้อยละ <strong>${spentPct}</strong> ของงบประมาณทั้งหมด คงเหลืองบประมาณสุทธิ
      <strong style="color:${totalR<0?'#b91c1c':_NAVY}">${_fmtFull(totalR)} บาท</strong>
      ทั้งนี้ มีโครงการที่ดำเนินการแล้วเสร็จ <strong>${done}</strong> โครงการ อยู่ระหว่างดำเนินการ <strong>${prog}</strong> โครงการ
      และยังไม่เริ่มดำเนินการ <strong>${pend}</strong> โครงการ
    </p>
    <div style="font-size:14px;font-weight:700;color:${_NAVY};margin-bottom:8px">สรุปความก้าวหน้ารายยุทธศาสตร์</div>
    <ul style="font-size:13.5px;padding-left:22px;margin-bottom:6px">${doneStrategies}</ul>
  </div>`;
}

/* ─── หน้าลงนามรับรองรายงาน ─── */
function _buildSignatureHTML(dateStr){
  const sigCol = (role) => `
    <div style="flex:1;text-align:center;padding:0 14px">
      <div style="height:56px"></div>
      <div style="border-bottom:1px dotted ${_INK_SOFT};margin-bottom:8px"></div>
      <div style="font-size:13px;color:${_INK_SOFT}">( ......................................................... )</div>
      <div style="font-size:13.5px;font-weight:700;color:${_INK};margin-top:6px">${role}</div>
      <div style="font-size:12px;color:${_INK_SOFT};margin-top:2px">วันที่ ......../......../..........</div>
    </div>`;
  return `
  <div style="font-family:'Sarabun',sans-serif;width:794px;background:#ffffff;color:${_INK};padding:40px 48px;box-sizing:border-box">
    <div style="font-size:18px;font-weight:700;color:${_NAVY};border-bottom:2px solid ${_NAVY};padding-bottom:10px;margin-bottom:30px">การรับรองรายงาน</div>
    <p style="font-size:13.5px;color:${_INK_SOFT};margin-bottom:60px">
      ข้าพเจ้าขอรับรองว่าข้อมูลผลการดำเนินงานและการใช้จ่ายงบประมาณในรายงานฉบับนี้ถูกต้องตรงตามความเป็นจริง
      ณ วันที่ ${dateStr}
    </p>
    <div style="display:flex;justify-content:space-between;margin-bottom:50px">
      ${sigCol('ผู้จัดทำรายงาน')}
      ${sigCol('ผู้ตรวจสอบ')}
    </div>
    <div style="display:flex;justify-content:center">
      <div style="width:50%">${sigCol('ผู้รับรอง / ผู้อนุมัติ')}</div>
    </div>
  </div>`;
}

/* ─── Build HTML for a single PDF "page" (A4 width 794px) ─── */
function _buildOverviewHTML(fp, qLabel) {
  const totalB = fp.reduce((a,p)=>a+(p.budget||0),0);
  const totalS = fp.reduce((a,p)=>a+(p.spent||0),0);
  const totalPO= fp.reduce((a,p)=>a+(p.po||0),0);
  const totalR = totalB-totalS-totalPO;
  const done   = fp.filter(p=>p.status==='done').length;
  const prog   = fp.filter(p=>p.status==='progress').length;
  const pend   = fp.filter(p=>p.status==='pending').length;
  const usedPct = totalB>0 ? Math.round((totalS+totalPO)/totalB*100) : 0;

  const statusRows = [
    {label:'✅ แล้วเสร็จ', n:done, color:'#059669'},
    {label:'⏳ อยู่ระหว่างดำเนินการ', n:prog, color:'#d97706'},
    {label:'⭕ ยังไม่เริ่มดำเนินการ', n:pend, color:'#9aa3b2'},
  ];

  const stratRows = [1,2,3,4,5].map((s,i)=>{
    const ps = fp.filter(p=>p.strategy==s);
    if (!ps.length) return '';
    const b = ps.reduce((a,p)=>a+(p.budget||0),0);
    const spent = ps.reduce((a,p)=>a+(p.spent||0),0);
    const po = ps.reduce((a,p)=>a+(p.po||0),0);
    const rem = b-spent-po;
    const zebra = i%2===1 ? '#f6f8fc' : '#fff';
    return `<tr>
      ${_cpCell(_S_NAMES[s]+' · '+_S_FULL[s],{bg:zebra})}
      ${_cpCell(ps.length,{center:true,bg:zebra})}
      ${_cpCell(_fmtFull(b),{right:true,bg:zebra})}
      ${_cpCell(_fmtFull(spent),{right:true,bg:zebra})}
      ${_cpCell(_fmtFull(po),{right:true,bg:zebra})}
      ${_cpCell(_fmtFull(rem),{right:true,color:'#059669',bg:zebra})}
    </tr>`;
  }).join('');

  return `
  <div style="font-family:'Sarabun',sans-serif;width:794px;background:#fff;padding:0 28px 20px;color:${_INK};font-size:11px;line-height:1.7;box-sizing:border-box">
    <div style="padding:22px 0 14px;border-bottom:2px solid ${_NAVY};margin-bottom:14px">
      <div style="font-size:11.5px;color:${_INK_SOFT};margin-bottom:4px">${_ORG_NAME_TH}</div>
      <div style="font-size:19px;font-weight:700;color:${_NAVY};margin-bottom:2px">ภาพรวมผลการดำเนินงานทุกยุทธศาสตร์</div>
      <div style="font-size:12.5px;color:${_INK_SOFT}">ปีงบประมาณ พ.ศ. 2569 · ${qLabel} · ${fp.length} โครงการ</div>
    </div>

    <div style="font-size:10.5px;text-align:justify;margin-bottom:14px">
      แผนปฏิบัติการประจำปีงบประมาณ พ.ศ. 2569 ครอบคลุมทั้งสิ้น <strong>${fp.length}</strong> โครงการ คิดเป็นงบประมาณรวม
      <strong>${_fmtFull(totalB)}</strong> บาท ณ ปัจจุบันมีการเบิกจ่ายและก่อหนี้ผูกพัน (ใช้ไป + PO) แล้วรวม
      <strong>${_fmtFull(totalS+totalPO)}</strong> บาท คิดเป็นร้อยละ <strong>${usedPct}</strong> ของงบประมาณ
      คงเหลืองบประมาณที่ยังไม่ได้เบิกจ่ายอีก <strong>${_fmtFull(totalR)}</strong> บาท
    </div>

    ${_cpSectionHeader('ก','งบประมาณโดยสรุป',_NAVY)}
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:10px">
      <tr>${_cpCell('งบประมาณรวมทุกยุทธศาสตร์',{bold:true,bg:'#e3e9f6'})}${_cpCell(_fmtFull(totalB)+' บาท',{right:true,bold:true,bg:'#e3e9f6',width:'150px'})}</tr>
      <tr>${_cpCell('ใช้ไป + PO (ก่อหนี้ผูกพัน)',{bg:'#f6f8fc'})}${_cpCell(_fmtFull(totalS+totalPO)+' บาท',{right:true,bg:'#f6f8fc',width:'150px'})}</tr>
      <tr>${_cpCell('คงเหลือ',{bold:true})}${_cpCell(_fmtFull(totalR)+' บาท',{right:true,bold:true,color:totalR<0?'#dc2626':'#059669',width:'150px'})}</tr>
    </table>

    ${_cpSectionHeader('ข','สถานะการดำเนินงานโครงการ',_NAVY)}
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:10px">
      <tr>${_cpCell('สถานะโครงการ',{bold:true,bg:'#e3e9f6'})}${_cpCell('จำนวนโครงการ',{bold:true,center:true,bg:'#e3e9f6',width:'110px'})}${_cpCell('สัดส่วน',{bold:true,center:true,bg:'#e3e9f6',width:'90px'})}</tr>
      ${statusRows.map((r,i)=>{
        const zebra = i%2===1 ? '#f6f8fc' : '#fff';
        const pctS = fp.length ? Math.round(r.n/fp.length*100) : 0;
        return `<tr>${_cpCell(r.label,{color:r.color,bold:true,bg:zebra})}${_cpCell(r.n,{center:true,bg:zebra})}${_cpCell(pctS+'%',{center:true,bg:zebra})}</tr>`;
      }).join('')}
    </table>

    ${_cpSectionHeader('ค','สรุปงบประมาณและจำนวนโครงการแยกตามยุทธศาสตร์',_NAVY)}
    <table style="width:100%;border-collapse:collapse;table-layout:fixed">
      <tr>
        ${_cpCell('ยุทธศาสตร์',{bold:true,center:true,bg:'#e3e9f6'})}
        ${_cpCell('โครงการ',{bold:true,center:true,bg:'#e3e9f6',width:'55px',small:true})}
        ${_cpCell('งบอนุมัติ',{bold:true,center:true,bg:'#e3e9f6',width:'85px',small:true})}
        ${_cpCell('ใช้ไป',{bold:true,center:true,bg:'#e3e9f6',width:'80px',small:true})}
        ${_cpCell('PO',{bold:true,center:true,bg:'#e3e9f6',width:'75px',small:true})}
        ${_cpCell('คงเหลือ',{bold:true,center:true,bg:'#e3e9f6',width:'80px',small:true})}
      </tr>
      ${stratRows}
      <tr>
        ${_cpCell('รวมทั้งหมด',{bold:true,center:true,bg:'#e3e9f6',colspan:2})}
        ${_cpCell(_fmtFull(totalB),{right:true,bold:true,bg:'#eef2ff'})}
        ${_cpCell(_fmtFull(totalS),{right:true,bold:true,bg:'#eef2ff'})}
        ${_cpCell(_fmtFull(totalPO),{right:true,bold:true,bg:'#eef2ff'})}
        ${_cpCell(_fmtFull(totalR),{right:true,bold:true,color:'#059669',bg:'#eef2ff'})}
      </tr>
    </table>
  </div>`;
}

function _metricCard(bg, color, label, value, sub, compact) {
  const p = compact ? "10px 11px" : "14px 16px";
  const fs1 = compact ? "10" : "11";
  const fs2 = compact ? "15" : "20";
  return `<div style="background:${bg};border:1px solid ${color}33;border-radius:10px;padding:${p};border-left:4px solid ${color}">
    <div style="font-size:${fs1}px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px">${label}</div>
    <div style="font-size:${fs2}px;font-weight:700;color:${color};line-height:1.15;margin-bottom:2px">${value}</div>
    <div style="font-size:${fs1}px;color:#5a6477">${sub}</div>
  </div>`;
}

function _buildProjectsHTML(fp, qLabel, strategyFilter) {
  let filtered = strategyFilter==='all' ? fp : fp.filter(p=>p.strategy==strategyFilter);
  const strategies = strategyFilter==='all' ? [1,2,3,4,5] : [parseInt(strategyFilter)];

  let html = `
  <div style="font-family:'Sarabun',sans-serif;width:794px;background:#ffffff;padding:0;color:${_INK};line-height:1.6;box-sizing:border-box">
    <div style="padding:22px 28px 14px;border-bottom:2px solid ${_NAVY}">
      <div style="font-size:11.5px;color:${_INK_SOFT};margin-bottom:4px">${_ORG_NAME_TH}</div>
      <div style="font-size:19px;font-weight:700;color:${_NAVY};margin-bottom:2px">รายงานสรุปผลการดำเนินงานรายโครงการ</div>
      <div style="font-size:12.5px;color:${_INK_SOFT}">ปีงบประมาณ พ.ศ. 2569 · ${qLabel}</div>
    </div>
    <div style="padding:14px 28px 20px">`;

  for (const s of strategies) {
    const ps = filtered.filter(p=>p.strategy==s);
    if (!ps.length) continue;
    const totalB = ps.reduce((a,p)=>a+(p.budget||0),0);
    const totalS = ps.reduce((a,p)=>a+(p.spent||0),0);
    const totalPO= ps.reduce((a,p)=>a+(p.po||0),0);
    const totalR = totalB-totalS-totalPO;

    html += `
      <div class="pdf-strategy-section">
        ${_cpSectionHeader(s, `${_S_NAMES[s]} · ${_S_FULL[s]} (${ps.length} โครงการ)`, _S_COLOR[s])}
        <div style="font-size:10.5px;color:#666;margin:4px 0 12px">งบอนุมัติรวม <strong>${_fmtFull(totalB)}</strong> บาท · ใช้ไป <strong>${_fmtFull(totalS)}</strong> บาท · PO <strong>${_fmtFull(totalPO)}</strong> บาท · คงเหลือ <strong style="color:#059669">${_fmtFull(totalR)}</strong> บาท</div>`;

    ps.forEach(p => {
      html += `<div class="pdf-project-block" style="margin-bottom:16px">${_buildProjectDetailPageHTML_69(p, 2569, true, true)}</div>`;
    });

    html += `
      </div>
      <div style="height:8px"></div>`;
  }

  html += `
    </div>
  </div>`;
  return html;
}

function _miniMetric(label, value, color) {
  return `<div style="background:#f8fafc;border:1px solid #e4e7ed;border-radius:8px;padding:8px 10px;border-top:3px solid ${color}">
    <div style="font-size:10px;color:#6b7280;margin-bottom:2px">${label}</div>
    <div style="font-size:12px;font-weight:700;color:${color}">${value}</div>
  </div>`;
}

/* ─── พิมพ์รายงานผ่านเบราว์เซอร์ (window.print → เลือกปลายทาง "Save as PDF") ───
   เปลี่ยนจากวิธีเดิม (html2canvas → jsPDF วาดเป็นภาพ) มาใช้การพิมพ์จริงของเบราว์เซอร์
   ทำให้ตัวอักษรคมชัด ค้นหา/คัดลอกได้ และไม่มีปัญหาการจัดหน้าเพี้ยนจากการแปลงเนื้อหาเป็นภาพ */

const _PDF_PAGE_CSS = `
  #pdfPrintRoot { font-family:'Sarabun',sans-serif; }
  @media screen {
    #pdfPrintRoot { display: none !important; }
  }
  @media print {
    @page { size: A4 portrait; margin: 14mm 12mm; }
    body.pdf-printing > *:not(#pdfPrintRoot) { display: none !important; }
    body.pdf-printing #pdfPrintRoot { display: block !important; }
    #pdfPrintRoot * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    /* แต่ละ "หน้า" หลัก (ปก/สรุปผู้บริหาร/ภาพรวม/หน้าลงนาม) ขึ้นหน้าใหม่เสมอ */
    #pdfPrintRoot .pdf-page { break-after: page; page-break-after: always; }
    #pdfPrintRoot .pdf-page:last-child { break-after: auto; page-break-after: auto; }
    #pdfPrintRoot .pdf-page-start { break-before: page; page-break-before: always; }
    /* ── ป้องกันเนื้อหาถูกตัดคาบข้ามหน้า ── */
    #pdfPrintRoot .pdf-project-block,
    #pdfPrintRoot .pdf-strategy-header,
    #pdfPrintRoot .pdf-strategy-footer,
    #pdfPrintRoot .pdf-budget-bar,
    #pdfPrintRoot .pdf-metric-row,
    #pdfPrintRoot .pdf-image-block,
    #pdfPrintRoot table, #pdfPrintRoot thead {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    #pdfPrintRoot thead { break-after: avoid; page-break-after: avoid; }
    /* แต่ละยุทธศาสตร์ขึ้นหน้าใหม่ */
    #pdfPrintRoot .pdf-strategy-section { break-before: page; page-break-before: always; }
    #pdfPrintRoot .pdf-strategy-section:first-child { break-before: avoid; page-break-before: avoid; }
  }
`;

/* สร้าง (หรือดึง) พื้นที่ซ่อนสำหรับใส่เนื้อหารายงานก่อนสั่งพิมพ์ */
function _ensurePdfPrintRoot() {
  let root = document.getElementById('pdfPrintRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'pdfPrintRoot';
    document.body.appendChild(root);
  }
  let style = document.getElementById('pdfPrintStyle');
  if (!style) {
    style = document.createElement('style');
    style.id = 'pdfPrintStyle';
    style.textContent = _PDF_PAGE_CSS;
    document.head.appendChild(style);
  }
  return root;
}

/* รอให้รูปภาพทุกรูปในรายงานโหลดเสร็จ (หรือ error) ก่อนเปิดหน้าต่างพิมพ์ ป้องกันรูปภาพว่างในไฟล์ PDF */
function _waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  if (!imgs.length) return Promise.resolve();
  return Promise.all(imgs.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(res => {
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }));
}

async function generatePDF() {
  const btn = document.getElementById('pdfGenBtn');
  btn.disabled = true;
  btn.textContent = '⏳ กำลังเตรียมเอกสาร...';
  document.getElementById('pdfProgress').classList.add('show');

  const resetBtn = () => {
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> สร้าง PDF';
  };

  try {
    const qSel   = document.getElementById('pdfQuarterSel').value;
    const sSel   = document.getElementById('pdfStrategySel').value;
    const qLabel = _Q_LABELS[qSel];
    const fp     = qSel==='all' ? [...projects] : projects.filter(p=>p.quarter===qSel||p.quarter==='all');

    const typeLabel = _pdfOptSelected===1?'ภาพรวมยุทธศาสตร์':_pdfOptSelected===2?'รายโครงการ':'ฉบับสมบูรณ์';
    const safeName  = qLabel.replace(/[()\–·\s]+/g,'_');
    const fileName  = `รายงานผลการดำเนินงาน_${typeLabel}_${safeName}_2569`;
    const dateStr   = _thaiDateNow();

    // ── 1. สร้างเนื้อหารายงาน (ปก → สรุปผู้บริหาร → เนื้อหา → หน้าลงนาม) ──
    _pdfProgress('📄 กำลังจัดทำหน้าปกและเอกสารรับรอง...', 20);
    const pages = [];
    pages.push(`<div class="pdf-page">${_buildCoverHTML(typeLabel.replace(/^ฉบับ/,''), qLabel, dateStr)}</div>`);
    pages.push(`<div class="pdf-page">${_buildExecSummaryHTML(fp, qLabel)}</div>`);

    _pdfProgress('📊 กำลังสร้างเนื้อหารายงาน...', 45);
    if (_pdfOptSelected === 1 || _pdfOptSelected === 3) {
      pages.push(`<div class="pdf-page">${_buildOverviewHTML(fp, qLabel)}</div>`);
    }
    if (_pdfOptSelected === 2 || _pdfOptSelected === 3) {
      // _buildProjectsHTML มี .pdf-strategy-section ของตัวเองซึ่งขึ้นหน้าใหม่ทุกยุทธศาสตร์อยู่แล้ว
      pages.push(_buildProjectsHTML(fp, qLabel, sSel));
    }
    pages.push(`<div class="pdf-page-start">${_buildSignatureHTML(dateStr)}</div>`);

    // ── 2. ใส่เนื้อหาลงพื้นที่พิมพ์ที่ซ่อนอยู่ แล้วรอฟอนต์/รูปภาพให้พร้อม ──
    _pdfProgress('🖼️ กำลังโหลดรูปภาพและแบบอักษร...', 65);
    const root = _ensurePdfPrintRoot();
    root.innerHTML = pages.join('');
    await document.fonts.ready;
    await _waitForImages(root);
    await new Promise(r => setTimeout(r, 150));

    // ── 3. เปิดหน้าต่างพิมพ์ของเบราว์เซอร์ — ผู้ใช้เลือกปลายทางเป็น "Save as PDF" ได้เอง ──
    _pdfProgress('🖨️ กำลังเปิดหน้าต่างพิมพ์ · เลือกปลายทาง "Save as PDF"', 90);
    const prevTitle = document.title;
    document.title = fileName;
    document.body.classList.add('pdf-printing');

    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      document.body.classList.remove('pdf-printing');
      document.title = prevTitle;
      root.innerHTML = '';
      window.removeEventListener('afterprint', cleanup);
      resetBtn();
      _pdfProgress('✅ พร้อมสำหรับบันทึกไฟล์', 100);
      setTimeout(() => {
        closePdfModal();
        showToast('✅ เปิดหน้าต่างพิมพ์แล้ว · เลือก "บันทึกเป็น PDF (Save as PDF)" เพื่อดาวน์โหลด', 6000);
      }, 300);
    };
    window.addEventListener('afterprint', cleanup);

    window.print();

    // สำรองไว้เผื่อบางเบราว์เซอร์ไม่ยิง afterprint (เช่นบางเบราว์เซอร์บนมือถือ)
    setTimeout(cleanup, 30000);

  } catch(err) {
    console.error('PDF Error:', err);
    _pdfProgress('❌ เกิดข้อผิดพลาด: ' + err.message, 0);
    showToast('❌ ' + err.message, 4000);
    document.body.classList.remove('pdf-printing');
    resetBtn();
  }
}

// Close PDF modal on backdrop click
document.getElementById('pdfModalOverlay').addEventListener('click', e=>{ if(e.target===e.currentTarget) closePdfModal(); });

// ===== KEYBOARD =====
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('lightboxOverlay').classList.contains('open')){ closeLightbox(); return; }
    closeDetail();
    document.getElementById('deleteOverlay').classList.remove('open');
  }
  if(document.getElementById('lightboxOverlay').classList.contains('open')){
    if(e.key==='ArrowLeft') lightboxNav(-1);
    if(e.key==='ArrowRight') lightboxNav(1);
  }
});

// modalOverlay: ลบ click-outside ออก — ปิดได้แค่ปุ่ม "ยกเลิก" หรือ "บันทึก" เท่านั้น
document.getElementById('detailOverlay').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeDetail(); });
document.getElementById('deleteOverlay').addEventListener('click',e=>{ if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); });

// ===== INIT =====
// _pendingSaveTs = timestamp ล่าสุดที่กดบันทึก (ใช้กัน Sheet ทับข้อมูลใหม่)
window._pendingSaveTs = 0;

(function initApp(){
  _initGasUI();
  const overlay = document.getElementById('initLoadingOverlay');

  // ── โหลด localStorage ก่อนเสมอ (แสดงผลทันที ไม่รอ network) ──
  loadFromLocal();
  if(overlay) overlay.style.display='none';
  updateDashboard();

  // ── Apply auth UI state ──
  _applyAuthUI();
  // ถ้าไม่มี session → แสดง auth modal
  if (!_currentUser) {
    setTimeout(() => openAuthModal('login'), 300);
  }

  // ── ฟังก์ชัน sync จาก Sheet ──────────────────────────────────
  // safe=true  → ป้องกันทับข้อมูลที่เพิ่งบันทึกไปภายใน 10 วินาที
  // safe=false → ทับเสมอ (ใช้ตอนกดปุ่ม manual)
  function syncFromSheet(showToast_, safe){
    if(!GAS_ENABLED || !_gasUrl || _gasUrl.includes('YOUR_GAS')) return Promise.resolve();
    const st = document.getElementById('gsStatus');
    return fetch(`${_gasUrl}?action=getAll`, { redirect:'follow' })
      .then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
      .then(res=>{
        if(!res.success) throw new Error(res.message||'GAS error');
        // ถ้า safe=true และเพิ่งบันทึกไปไม่ถึง 10 วิ → ข้ามการทับ
        if(safe && Date.now() - window._pendingSaveTs < 10000){
          console.log('syncFromSheet: skipped — recent save detected');
          return;
        }
        if(res.data && res.data.length > 0){
          projects = res.data;
          saveToLocal(true);
          renderTable();
          updateDashboard();
        }
        const now2 = new Date().toLocaleTimeString('th-TH');
        if(st) st.innerHTML=`<div class="status-msg status-ok">✅ โหลดข้อมูลล่าสุดสำเร็จ ${projects.length} โครงการ · ${now2}</div>`;
        if(showToast_) showToast(`🔄 ข้อมูลล่าสุดจาก Sheet (${projects.length} โครงการ)`, 2500);
      })
      .catch(err=>{
        console.warn('Sheet sync failed:', err.message);
        if(st) st.innerHTML=`<div class="status-msg status-err">⚠️ โหลดจาก Sheet ไม่สำเร็จ — ใช้ข้อมูลในเครื่อง (${err.message})</div>`;
      });
  }

  // expose สำหรับปุ่ม manual (loadFromSheet ใช้ fetch ของตัวเอง ไม่เกี่ยว)
  window._syncFromSheetSilent = ()=>syncFromSheet(false, true);

  // ✅ โหลด Sheet ทันทีตอนเปิดหน้า (safe mode — ไม่ทับถ้าเพิ่งบันทึก)
  // เครื่องอื่นที่ยังไม่เคยบันทึกจะได้ข้อมูลล่าสุดจาก Sheet เสมอ
  syncFromSheet(false, true);
})();

/* ============================================================
   AUTH SYSTEM (Firebase + GAS + Local Fallback) — ปี 2569
   ============================================================ */
// ══ AUTH SYSTEM (ปี 2569) — Firebase + GAS + Local Fallback ══════════════════

// ── Welcome popup หลัง login ────────────────────────────────
function _showLoginSuccess(name, position, dept, isOffline=false) {
  if (!document.getElementById('_wlcSt')) {
    const s = document.createElement('style');
    s.id = '_wlcSt';
    s.textContent = `
      @keyframes _wlcOverlayIn { from{opacity:0} to{opacity:1} }
      @keyframes _wlcOverlayOut { from{opacity:1} to{opacity:0} }
      @keyframes _wlcCardIn {
        0%  { opacity:0; transform:translateY(32px) scale(.94) }
        65% { transform:translateY(-6px) scale(1.01) }
        100%{ opacity:1; transform:translateY(0) scale(1) }
      }
      @keyframes _wlcCardOut { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(.9) translateY(20px)} }
      @keyframes _wlcShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes _wlcPulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)} 50%{box-shadow:0 0 0 10px rgba(34,197,94,0)} }
      @keyframes _wlcBar { from{width:0} to{width:100%} }
      ._wlc-overlay {
        position:fixed;inset:0;z-index:99999;
        display:flex;align-items:center;justify-content:center;
        background:rgba(15,23,42,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
        animation:_wlcOverlayIn .3s ease forwards;
      }
      ._wlc-card {
        background:#fff;border-radius:20px;
        box-shadow:0 24px 64px rgba(0,0,0,.22),0 4px 16px rgba(0,0,0,.1);
        width:340px;overflow:hidden;
        animation:_wlcCardIn .45s cubic-bezier(.22,.68,0,1.15) forwards;
        font-family:'Sarabun',sans-serif;
      }
      ._wlc-header {
        padding:28px 24px 20px;
        background:linear-gradient(135deg,#0f4c81 0%,#1a6bb0 50%,#0d7a4e 100%);
        background-size:200% auto;animation:_wlcShimmer 3s linear infinite;
        text-align:center;position:relative;
      }
      ._wlc-avatar {
        width:64px;height:64px;border-radius:50%;
        background:rgba(255,255,255,.2);border:3px solid rgba(255,255,255,.6);
        display:flex;align-items:center;justify-content:center;
        font-size:26px;font-weight:700;color:#fff;margin:0 auto 12px;
        animation:_wlcPulse 2s ease infinite;
      }
      ._wlc-greeting { font-size:13px;color:rgba(255,255,255,.8);margin-bottom:4px;letter-spacing:.3px; }
      ._wlc-name { font-size:18px;font-weight:700;color:#fff;line-height:1.3; }
      ._wlc-body { padding:20px 24px 8px; }
      ._wlc-row {
        display:flex;align-items:center;gap:10px;
        padding:10px 14px;border-radius:10px;
        background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:8px;
      }
      ._wlc-row-icon { font-size:18px;flex-shrink:0; }
      ._wlc-row-label { font-size:10.5px;color:#94a3b8;margin-bottom:1px; }
      ._wlc-row-val { font-size:13.5px;font-weight:600;color:#1e293b;line-height:1.3; }
      ._wlc-offline {
        margin:0 24px 12px;padding:7px 12px;border-radius:8px;
        background:#fffbeb;border:1px solid #fde68a;font-size:11.5px;color:#92400e;text-align:center;
      }
      ._wlc-footer { padding:0 24px 20px;margin-top:4px; }
      ._wlc-btn {
        width:100%;padding:11px;border:none;border-radius:10px;
        background:linear-gradient(135deg,#0f4c81,#1a6bb0);
        color:#fff;font-size:14px;font-weight:600;
        font-family:'Sarabun',sans-serif;cursor:pointer;transition:opacity .15s,transform .15s;
      }
      ._wlc-btn:hover { opacity:.9;transform:translateY(-1px); }
      ._wlc-progress { height:3px;background:#f1f5f9; }
      ._wlc-progress-fill {
        height:100%;background:linear-gradient(90deg,#0f4c81,#22c55e);
        animation:_wlcBar var(--d,3.5s) linear forwards;
      }
    `;
    document.head.appendChild(s);
  }

  const initial = (name||'?').replace(/^(นาย|นาง|นางสาว|ดร\.?|ศ\.?|รศ\.?|ผศ\.?|พญ\.?|นพ\.?|ว่าที่)\s*/,'').trim().charAt(0).toUpperCase();
  const dur = 3800;
  const overlay = document.createElement('div');
  overlay.className = '_wlc-overlay';

  const posRow  = position ? `<div class="_wlc-row"><div class="_wlc-row-icon">💼</div><div><div class="_wlc-row-label">ตำแหน่ง</div><div class="_wlc-row-val">${position}</div></div></div>` : '';
  const deptRow = dept     ? `<div class="_wlc-row"><div class="_wlc-row-icon">🏢</div><div><div class="_wlc-row-label">สังกัด</div><div class="_wlc-row-val">${dept}</div></div></div>` : '';
  const offlineBadge = isOffline ? '<div class="_wlc-offline">⚠️ ใช้ข้อมูลในเครื่อง (ไม่ได้เชื่อมต่อเซิร์ฟเวอร์)</div>' : '';

  overlay.innerHTML = `
    <div class="_wlc-card">
      <div class="_wlc-header">
        <div class="_wlc-avatar">${initial}</div>
        <div class="_wlc-greeting">ยินดีต้อนรับเข้าสู่ระบบ</div>
        <div class="_wlc-name">${name}</div>
      </div>
      <div class="_wlc-body">${posRow}${deptRow}</div>
      ${offlineBadge}
      <div class="_wlc-footer">
        <button class="_wlc-btn" id="_wlcCloseBtn">เข้าสู่ระบบ →</button>
      </div>
      <div class="_wlc-progress"><div class="_wlc-progress-fill" style="--d:${dur/1000}s"></div></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    overlay.style.animation = '_wlcOverlayOut .3s ease forwards';
    overlay.querySelector('._wlc-card').style.animation = '_wlcCardOut .3s ease forwards';
    setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 300);
  };
  overlay.querySelector('#_wlcCloseBtn').addEventListener('click', close);
  overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
  setTimeout(close, dur);
}

// ═══════════════════════════════════════════════════════
// RISK MANAGEMENT MODULE
// ═══════════════════════════════════════════════════════

const RISK_STORAGE_KEY = 'dltv_risks_2569';
let risks = [];
let editingRiskId = null;
let deleteRiskId  = null;
let rmCurrentPage = 1;
const RM_PAGE_SIZE = 15;
let riskView = 'project';            // 'project' | 'flat'
let _expandedProjects = {};          // track which project cards are open

// ── Google Apps Script code for the Risks sheet (paste-able) ──
const RISK_GAS_CODE = [
'// ============================================================',
'//  Risks.gs — เพิ่มต่อท้าย Code.gs เดิม (ระบบบริหารความเสี่ยง)',
'//  มูลนิธิการศึกษาทางไกลผ่านดาวเทียม (DLTV) · ปีงบประมาณ 2569',
'//  จะสร้าง Sheet ชื่อ "Risks" ให้อัตโนมัติเมื่อเรียกครั้งแรก',
'// ============================================================',
'',
"const RISKS_SHEET_NAME = 'Risks';",
'const RISKS_HEADERS = [',
"  'id','project','name','category','strategy','likelihood','impact',",
"  'status','residual','control','contingency','dueDate','reviewDate',",
"  'owner','quarter','note','lastEditedBy','lastEditedByPosition','lastEditedAt'",
'];',
'',
'// ── สร้าง/ดึง Sheet ความเสี่ยง ──',
'function getRisksSheet() {',
'  const ss = SpreadsheetApp.getActiveSpreadsheet();',
'  let sheet = ss.getSheetByName(RISKS_SHEET_NAME);',
'  if (!sheet) {',
'    sheet = ss.insertSheet(RISKS_SHEET_NAME);',
'    const h = sheet.getRange(1, 1, 1, RISKS_HEADERS.length);',
'    h.setValues([RISKS_HEADERS]);',
"    h.setBackground('#dc2626').setFontColor('#ffffff').setFontWeight('bold')",
"     .setHorizontalAlignment('center').setVerticalAlignment('middle');",
'    sheet.setFrozenRows(1);',
'    sheet.setRowHeight(1, 32);',
'    const widths = [50,220,260,110,80,90,90,110,90,260,240,100,100,140,80,200,140,140,160];',
'    widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));',
'    return sheet;',
'  }',
'  // Migration: sheets created before lastEditedByPosition existed are missing',
'  // trailing columns — add them so old sheets stay compatible.',
'  const lastCol = sheet.getLastColumn();',
'  if (lastCol < RISKS_HEADERS.length) {',
'    const missing = RISKS_HEADERS.slice(lastCol);',
'    const range = sheet.getRange(1, lastCol + 1, 1, missing.length);',
'    range.setValues([missing]);',
"    range.setBackground('#dc2626').setFontColor('#ffffff').setFontWeight('bold');",
'  }',
'  return sheet;',
'}',
'',
'function riskRowToObject(row) {',
'  return {',
'    id: parseInt(row[0]) || 0, project: row[1] || \'\', name: row[2] || \'\',',
'    category: row[3] || \'\', strategy: String(row[4] || \'\'),',
'    likelihood: parseInt(row[5]) || 1, impact: parseInt(row[6]) || 1,',
'    status: row[7] || \'open\', residual: row[8] || \'\',',
'    control: row[9] || \'\', contingency: row[10] || \'\',',
'    dueDate: row[11] || \'\', reviewDate: row[12] || \'\',',
'    owner: row[13] || \'\', quarter: String(row[14] || \'all\'),',
'    note: row[15] || \'\', lastEditedBy: row[16] || \'\',',
'    lastEditedByPosition: row[17] || \'\', lastEditedAt: row[18] || \'\'',
'  };',
'}',
'',
'function riskObjectToRow(d) {',
'  return [',
'    d.id || 0, d.project || \'\', d.name || \'\', d.category || \'\',',
'    d.strategy || \'\', d.likelihood || 1, d.impact || 1,',
'    d.status || \'open\', d.residual || \'\', d.control || \'\',',
'    d.contingency || \'\', d.dueDate || \'\', d.reviewDate || \'\',',
'    d.owner || \'\', d.quarter || \'all\', d.note || \'\',',
'    d.lastEditedBy || \'\', d.lastEditedByPosition || \'\', d.lastEditedAt || \'\'',
'  ];',
'}',
'',
'function getAllRisks() {',
'  const sheet = getRisksSheet();',
'  const lastRow = sheet.getLastRow();',
'  if (lastRow < 2) return { success: true, data: [], count: 0 };',
'  const values = sheet.getRange(2, 1, lastRow - 1, RISKS_HEADERS.length).getValues();',
'  const data = values.filter(r => r[0] !== \'\' && r[0] !== null).map(riskRowToObject);',
'  return { success: true, data: data, count: data.length };',
'}',
'',
'function saveRisk(data) {',
'  const sheet = getRisksSheet();',
'  const lastRow = sheet.getLastRow();',
'  let newId = parseInt(data.id) || 0;',
'  if (newId === 0) {',
'    if (lastRow >= 2) {',
'      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();',
'      const max = Math.max.apply(null, ids.map(function(r){ return parseInt(r[0]) || 0; }));',
'      newId = isFinite(max) && max > 0 ? max + 1 : 1;',
'    } else { newId = 1; }',
'  }',
'  data.id = newId;',
'  // หาแถวเดิม ถ้ามีให้ update มิฉะนั้น append',
'  let targetRow = -1;',
'  if (lastRow >= 2) {',
'    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();',
'    for (let i = 0; i < ids.length; i++) {',
'      if (parseInt(ids[i][0]) === newId) { targetRow = i + 2; break; }',
'    }',
'  }',
'  if (targetRow > 0) {',
'    sheet.getRange(targetRow, 1, 1, RISKS_HEADERS.length).setValues([riskObjectToRow(data)]);',
'  } else {',
'    sheet.appendRow(riskObjectToRow(data));',
'  }',
'  return { success: true, id: newId, message: \'บันทึกความเสี่ยงสำเร็จ\' };',
'}',
'',
'function deleteRisk(id) {',
'  const sheet = getRisksSheet();',
'  const lastRow = sheet.getLastRow();',
'  if (lastRow < 2) return { success: false, message: \'ไม่พบข้อมูล\' };',
'  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();',
'  for (let i = 0; i < ids.length; i++) {',
'    if (parseInt(ids[i][0]) === parseInt(id)) { sheet.deleteRow(i + 2); return { success: true }; }',
'  }',
'  return { success: false, message: \'ไม่พบ ID: \' + id };',
'}',
'',
'function bulkSaveRisks(dataArray) {',
'  const sheet = getRisksSheet();',
'  const lastRow = sheet.getLastRow();',
'  if (lastRow >= 2) sheet.deleteRows(2, lastRow - 1);',
'  if (!dataArray || !dataArray.length) return { success: true, count: 0 };',
'  const rows = dataArray.map(riskObjectToRow);',
'  sheet.getRange(2, 1, rows.length, RISKS_HEADERS.length).setValues(rows);',
'  return { success: true, count: rows.length };',
'}',
'',
'// ── เพิ่ม action เหล่านี้เข้าไปใน doGet(e) เดิม (ก่อน return Unknown) ──',
'//   if (action === \'getAllRisks\')   return respond(getAllRisks());',
'//   if (action === \'saveRisk\')      return respond(saveRisk(params.data ? JSON.parse(params.data) : params));',
'//   if (action === \'deleteRisk\')    return respond(deleteRisk(params.id));',
'//   if (action === \'bulkSaveRisks\') return respond(bulkSaveRisks(params.data ? JSON.parse(params.data) : []));',
'//',
'// ── และเพิ่มใน doPost(e) เดิม (ก่อน return Unknown) ──',
'//   if (action === \'saveRisk\')      return jsonResponse(saveRisk(parseData(body.data) || body));',
'//   if (action === \'deleteRisk\')    return jsonResponse(deleteRisk(body.id));',
'//   if (action === \'bulkSaveRisks\') return jsonResponse(bulkSaveRisks(parseData(body.data)));'
].join('\n');

// ── Likelihood / Impact label maps ──
const LH_LABELS = {1:'น้อยมาก',2:'น้อย',3:'ปานกลาง',4:'มาก',5:'แน่นอน'};
const IM_LABELS = {1:'น้อยมาก',2:'น้อย',3:'ปานกลาง',4:'มาก',5:'สูงมาก'};
const CAT_NAMES = {
  strategic:'ด้านยุทธศาสตร์', operational:'ด้านปฏิบัติการ',
  financial:'ด้านการเงิน', compliance:'ด้านกฎระเบียบ',
  reputation:'ด้านชื่อเสียง', other:'อื่นๆ'
};
const STATUS_RM = {
  open:'ยังไม่ดำเนินการ', inprogress:'กำลังดำเนินการ',
  controlled:'ควบคุมได้แล้ว', closed:'ปิดแล้ว'
};
const S_SHORT = {1:'ยทศ.1',2:'ยทศ.2',3:'ยทศ.3',4:'ยทศ.4',5:'งบ.สนก.'};

// ── Risk level helper ──
function getRiskLevel(score) {
  if (score >= 16) return { key:'veryhigh', label:'🔴 สูงมาก', color:'#dc2626' };
  if (score >= 10) return { key:'high',     label:'🟠 สูง',    color:'#ea580c' };
  if (score >= 5)  return { key:'medium',   label:'🟡 ปานกลาง', color:'#d97706' };
  return               { key:'low',      label:'🟢 ต่ำ',    color:'#16a34a' };
}
function getRiskCellClass(l, i) {
  const s = l * i;
  if (s >= 16) return 'cl-veryhigh';
  if (s >= 10) return 'cl-high';
  if (s >= 5)  return 'cl-medium';
  return 'cl-low';
}

// ── Storage ──
function saveRisksToLocal() {
  try { localStorage.setItem(RISK_STORAGE_KEY, JSON.stringify(risks)); } catch(e) {}
}
function loadRisksFromLocal() {
  try {
    const d = localStorage.getItem(RISK_STORAGE_KEY);
    if (d) { const r = JSON.parse(d); if (Array.isArray(r)) { risks = r; return; } }
  } catch(e) {}
  // Default seed data for demonstration
  risks = [
    { id:1, project:'สนับสนุนชุดกิจกรรมการเรียนรู้ (ใบงานและใบความรู้) สำหรับนักเรียนโรงเรียนปลายทาง', name:'งบประมาณสนับสนุนชุดกิจกรรมการเรียนรู้ ไม่เพียงพอหรือล่าช้า', category:'financial', strategy:'3', likelihood:4, impact:5, control:'ติดตามงบประมาณจากสำนักงานมูลนิธิฯ อย่างใกล้ชิด จัดทำแผนการใช้จ่ายล่วงหน้า', contingency:'เจรจาขอรับการสนับสนุนเพิ่มเติมหรือปรับจำนวนชุดกิจกรรม', status:'inprogress', residual:'medium', dueDate:'2026-06-30', reviewDate:'2026-03-15', owner:'กลุ่มวิชาการ', quarter:'2', note:'' },
    { id:2, project:'งบบริหารสำนักงานประจำปี 2569', name:'ระบบ DLTV ขัดข้อง / ออกอากาศไม่ได้ในช่วงเวลาสำคัญ', category:'operational', strategy:'1', likelihood:2, impact:5, control:'มีระบบสำรอง (Backup) และแผนรับมือฉุกเฉิน ทีมเทคนิคพร้อมตลอด 24 ชม.', contingency:'สลับช่องออกอากาศ แจ้งโรงเรียนปลายทางทาง LINE Official', status:'controlled', residual:'low', dueDate:'', reviewDate:'2026-01-20', owner:'ฝ่ายเทคโนโลยีสารสนเทศ', quarter:'all', note:'ทดสอบแผนสำรองแล้วเมื่อ ม.ค.2569' },
    { id:3, project:'พัฒนาทักษะความรู้เพื่อเพิ่มประสิทธิภาพการปฏิบัติงาน', name:'บุคลากรขาดแคลน / ลาออก ส่งผลต่อการผลิตรายการ', category:'operational', strategy:'2', likelihood:3, impact:3, control:'วางแผนสืบทอดตำแหน่ง (Succession Plan) และพัฒนาทักษะภายในองค์กร', contingency:'จ้างฟรีแลนซ์หรือว่าจ้างภายนอกเป็นการชั่วคราว', status:'open', residual:'medium', dueDate:'2026-08-31', reviewDate:'', owner:'ฝ่ายบริหารงานบุคคล', quarter:'all', note:'' },
    { id:4, project:'พัฒนาความสามารถในการจัดการเรียนการสอนของครูสอนออกอากาศห้องเรียนต้นทาง', name:'ลิขสิทธิ์สื่อการสอนออนไลน์ที่นำมาใช้โดยไม่ได้รับอนุญาต', category:'compliance', strategy:'2', likelihood:2, impact:4, control:'จัดอบรมความรู้ลิขสิทธิ์แก่ทีมผลิตรายการ กำหนดแนวปฏิบัติการใช้สื่อ', contingency:'หยุดใช้สื่อดังกล่าวทันทีและขออนุญาตหรือหาสื่อทดแทน', status:'controlled', residual:'low', dueDate:'', reviewDate:'2026-01-19', owner:'ฝ่ายวิชาการ', quarter:'1', note:'อบรมเสร็จสิ้น 19 ม.ค.2569' },
    { id:5, project:'สนับสนุนชุดกิจกรรมการเรียนรู้ (ใบงานและใบความรู้) สำหรับนักเรียนโรงเรียนปลายทาง', name:'การจัดส่งชุดกิจกรรมถึงโรงเรียนปลายทางล่าช้า ไม่ทันเปิดภาคเรียน', category:'operational', strategy:'3', likelihood:3, impact:4, control:'วางแผนการจัดส่งล่วงหน้า ประสานงานกับบริษัทขนส่ง และติดตามสถานะรายสัปดาห์', contingency:'จัดส่งไฟล์ดิจิทัลให้โรงเรียนพิมพ์ใช้ชั่วคราวระหว่างรอของจริง', status:'inprogress', residual:'medium', dueDate:'2026-05-15', reviewDate:'2026-03-20', owner:'กลุ่มวิชาการ', quarter:'2', note:'' }
  ];
}

// ── Init page ──
function initRiskPage() {
  loadRisksFromLocal();
  populateRiskProjectList();
  // Show add button only for logged-in members
  const btn = document.getElementById('riskAddBtn');
  if (btn) btn.style.display = _isEditable() ? '' : 'none';
  updateRiskMetrics();
  buildRiskMatrix();
  buildCategoryBreakdown();
  renderRiskTable();
}

// ── Populate project datalist from existing projects ──
function populateRiskProjectList() {
  const dl = document.getElementById('riskProjectList');
  if (!dl || typeof projects === 'undefined') return;
  dl.innerHTML = projects.map(p =>
    `<option value="${(p.name||'').replace(/"/g,'&quot;')}" data-strategy="${p.strategy||''}"></option>`
  ).join('');
}

// ── Auto-fill strategy when a project is selected ──
function onRiskProjectChange() {
  const input = document.getElementById('riskProject');
  if (!input || typeof projects === 'undefined') return;
  const val = (input.value || '').trim();
  const match = projects.find(p => (p.name||'').trim() === val);
  if (match) {
    const strat = document.getElementById('riskStrategy');
    if (strat && match.strategy) strat.value = String(match.strategy);
    // suggest owner if available and field is empty
    const ownerEl = document.getElementById('riskOwner');
    if (ownerEl && !ownerEl.value && match.owner) ownerEl.value = match.owner;
  }
}

// ── Metrics ──
function updateRiskMetrics() {
  const total = risks.length;
  const high  = risks.filter(r => r.likelihood * r.impact >= 10).length;
  const med   = risks.filter(r => { const s = r.likelihood * r.impact; return s >= 5 && s < 10; }).length;
  const low   = risks.filter(r => r.likelihood * r.impact < 5).length;
  const done  = risks.filter(r => r.status === 'controlled' || r.status === 'closed').length;
  const setText = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
  setText('rmTotal', total);
  setText('rmHigh',  high);
  setText('rmMed',   med);
  setText('rmLow',   low);
  setText('rmDone',  done);
}

// ── Heat Map Matrix ──
function buildRiskMatrix() {
  const grid = document.getElementById('rmMatrixGrid');
  if (!grid) return;
  // Count risks per cell (only count risks that match current quarter filter)
  const qf = document.getElementById('riskQuarterFilter')?.value || '';
  const cells = {};
  risks.forEach(r => {
    if (qf && r.quarter && r.quarter !== 'all' && r.quarter !== qf) return;
    const key = r.likelihood + '_' + r.impact;
    cells[key] = (cells[key] || 0) + 1;
  });
  const LH_SHORT = ['', 'น้อยมาก', 'น้อย', 'ปานกลาง', 'มาก', 'แน่นอน'];
  const IM_SHORT = ['', 'น้อยมาก', 'น้อย', 'ปานกลาง', 'มาก', 'สูงมาก'];
  let html = '';
  // Top-left empty corner
  html += '<div class="rm-cell axis-label" style="min-height:auto;background:none"></div>';
  // X-axis header (Impact 1–5)
  for (let i = 1; i <= 5; i++) {
    html += `<div class="rm-cell axis-label" style="min-height:auto;flex-direction:column;line-height:1.2">
      <div style="font-weight:700;color:var(--text2)">${i}</div>
      <div style="font-size:9px">${IM_SHORT[i]}</div>
    </div>`;
  }
  // Rows: likelihood 5 down to 1
  for (let l = 5; l >= 1; l--) {
    html += `<div class="rm-cell axis-label" style="flex-direction:column;line-height:1.2">
      <div style="font-weight:700;color:var(--text2)">${l}</div>
      <div style="font-size:9px">${LH_SHORT[l]}</div>
    </div>`;
    for (let imp = 1; imp <= 5; imp++) {
      const score = l * imp;
      const cls = getRiskCellClass(l, imp);
      const cnt = cells[l+'_'+imp] || 0;
      const tooltip = cnt > 0
        ? `โอกาส ${l} × ผลกระทบ ${imp} = ${score} คะแนน · มีความเสี่ยง ${cnt} รายการ`
        : `โอกาส ${l} × ผลกระทบ ${imp} = ${score} คะแนน`;
      html += `<div class="rm-cell ${cls} ${cnt>0?'clickable':''}" title="${tooltip}" onclick="filterMatrixCell(${l},${imp})">
        <div class="rm-cell-score">${score}</div>
        ${cnt > 0 ? `<div class="rm-cell-badge">${cnt}</div>` : ''}
      </div>`;
    }
  }
  grid.innerHTML = html;
}

function filterMatrixCell(l, imp) {
  const cnt = risks.filter(r => r.likelihood === l && r.impact === imp).length;
  if (cnt === 0) return;
  // Set level filter to match this cell's level, then scroll to table
  const score = l * imp;
  const lvKey = getRiskLevel(score).key;
  const lf = document.getElementById('rmFilterLevel');
  if (lf) { lf.value = lvKey; renderRiskTable(); }
  showToast(`🔍 กรองระดับ "${getRiskLevel(score).label}" (คะแนน ${score})`);
  document.querySelector('.rm-table-wrap')?.scrollIntoView({ behavior:'smooth', block:'center' });
}

// ── Category Breakdown ──
function buildCategoryBreakdown() {
  const el = document.getElementById('rmCategoryBreakdown');
  if (!el) return;
  const cats = ['strategic','operational','financial','compliance','reputation','other'];
  const catColors = {strategic:'var(--accent)',operational:'var(--purple)',financial:'var(--green)',compliance:'var(--amber)',reputation:'var(--red)',other:'var(--text3)'};
  const total = risks.length || 1;
  let html = '';
  cats.forEach(cat => {
    const count = risks.filter(r => r.category === cat).length;
    const pct = Math.round(count / total * 100);
    if (count === 0) return;
    html += `<div style="display:flex;align-items:center;gap:10px">
      <div style="width:100px;font-size:12px;color:var(--text2);flex-shrink:0">${CAT_NAMES[cat]||cat}</div>
      <div style="flex:1;background:var(--surface2);border-radius:99px;height:8px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${catColors[cat]||'var(--accent)'};border-radius:99px;transition:width .4s"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--text);min-width:28px;text-align:right">${count}</div>
    </div>`;
  });
  if (!html) html = '<div style="color:var(--text3);font-size:13px;text-align:center;padding:1rem">ยังไม่มีข้อมูลความเสี่ยง</div>';
  el.innerHTML = html;
}

// ── Table ──
function setRiskView(view) {
  riskView = view;
  document.getElementById('rmViewProjectBtn')?.classList.toggle('active', view === 'project');
  document.getElementById('rmViewFlatBtn')?.classList.toggle('active', view === 'flat');
  rmCurrentPage = 1;
  renderRiskTable();
}

// Group filtered risks by project name, render expandable cards
function renderProjectView(list) {
  const container = document.getElementById('rmProjectView');
  if (!container) return;

  // Group by project (fallback to "(ไม่ระบุโครงการ)")
  const groups = {};
  list.forEach(r => {
    const key = (r.project && r.project.trim()) || '(ไม่ได้ระบุโครงการ)';
    (groups[key] = groups[key] || []).push(r);
  });

  // Sort groups: highest max-score first
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const maxA = Math.max(...groups[a].map(r => r.likelihood * r.impact));
    const maxB = Math.max(...groups[b].map(r => r.likelihood * r.impact));
    return maxB - maxA;
  });

  const canEdit = _isEditable();
  const resMap = { low:'🟢', medium:'🟡', high:'🟠', veryhigh:'🔴' };
  const stMap  = { open:'ยังไม่ดำเนินการ', inprogress:'กำลังดำเนินการ', controlled:'ควบคุมได้แล้ว', closed:'ปิดแล้ว' };

  container.innerHTML = sortedKeys.map(proj => {
    const items = groups[proj].slice().sort((a,b) => (b.likelihood*b.impact) - (a.likelihood*a.impact));
    const scores = items.map(r => r.likelihood * r.impact);
    const maxScore = Math.max(...scores);
    const maxLv = getRiskLevel(maxScore);
    const openCnt = items.filter(r => r.status !== 'controlled' && r.status !== 'closed').length;
    // strategy of first item (usually same across project)
    const strat = items[0].strategy ? (S_SHORT[items[0].strategy] || '') : '';

    // level distribution for the mini bar
    const dist = { low:0, medium:0, high:0, veryhigh:0 };
    items.forEach(r => { dist[getRiskLevel(r.likelihood*r.impact).key]++; });
    const total = items.length;
    const segColors = { veryhigh:'#dc2626', high:'#ea580c', medium:'#d97706', low:'#16a34a' };
    const bar = ['veryhigh','high','medium','low'].map(k =>
      dist[k] ? `<div class="rm-proj-bar-seg" style="width:${dist[k]/total*100}%;background:${segColors[k]}" title="${k}: ${dist[k]}"></div>` : ''
    ).join('');

    const isOpen = _expandedProjects[proj];

    // Factor rows
    const factors = items.map(r => {
      const sc = r.likelihood * r.impact;
      const lv = getRiskLevel(sc);
      const overdue = r.dueDate && new Date(r.dueDate) < new Date(new Date().toDateString()) && r.status!=='controlled' && r.status!=='closed';
      return `<div class="rm-factor" onclick="openRiskDetail(${r.id})">
        <div class="rm-factor-left">
          <div class="rm-factor-name">${r.name}</div>
          <div class="rm-factor-meta">
            <span class="rm-cat ${r.category||'other'}">${CAT_NAMES[r.category]||r.category||'-'}</span>
            <span class="rm-status ${r.status||'open'}">${stMap[r.status]||'-'}</span>
            ${r.residual ? `<span style="font-size:11px;color:var(--text3)">คงเหลือ: ${resMap[r.residual]||''}</span>` : ''}
            ${r.dueDate ? `<span style="font-size:11px;color:${overdue?'var(--red)':'var(--text3)'};font-weight:${overdue?'700':'400'}">${overdue?'⚠️ ':'📅 '}${new Date(r.dueDate).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'2-digit'})}</span>` : ''}
          </div>
          ${r.control ? `<div class="rm-factor-control"><b>แผนรองรับ:</b><span>${r.control}</span></div>` : ''}
        </div>
        <div class="rm-factor-right" onclick="event.stopPropagation()">
          <div class="rm-factor-score">
            <div class="rm-factor-score-num" style="color:${lv.color}">${sc}</div>
            <div style="font-size:9px;color:var(--text3)">L${r.likelihood}×I${r.impact}</div>
          </div>
          <span class="rm-badge ${lv.key}" style="font-size:10px">${lv.label}</span>
          <div class="rm-factor-actions">
            <button class="btn btn-sm" onclick="openRiskDetail(${r.id})" style="color:var(--s5);padding:3px 6px;font-size:12px" title="ดู">👁️</button>
            ${canEdit ? `<button class="btn btn-sm" onclick="openRiskForm(${r.id})" style="color:var(--accent);padding:3px 6px;font-size:12px" title="แก้ไข">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="openRiskDelete(${r.id})" style="padding:3px 6px;font-size:12px" title="ลบ">🗑️</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    return `<div class="rm-proj-card ${isOpen?'open':''}">
      <div class="rm-proj-head lv-${maxLv.key}" onclick="toggleProjectCard('${encodeURIComponent(proj)}')">
        <div class="rm-proj-chevron">▶</div>
        <div style="min-width:0">
          <div class="rm-proj-title">${proj}</div>
          <div class="rm-proj-sub">${strat ? strat+' · ' : ''}คลิกเพื่อ${isOpen?'ย่อ':'ขยาย'}ดูปัจจัยเสี่ยง</div>
        </div>
        <div class="rm-proj-stats">
          <div class="rm-proj-stat"><div class="rm-proj-stat-num" style="color:var(--accent)">${total}</div><div class="rm-proj-stat-lbl">ปัจจัยเสี่ยง</div></div>
          <div class="rm-proj-stat"><div class="rm-proj-stat-num" style="color:${maxLv.color}">${maxScore}</div><div class="rm-proj-stat-lbl">คะแนนสูงสุด</div></div>
          <div class="rm-proj-stat"><div class="rm-proj-stat-num" style="color:${openCnt>0?'var(--red)':'var(--green)'}">${openCnt}</div><div class="rm-proj-stat-lbl">ยังไม่ควบคุม</div></div>
          <div style="text-align:center">
            <div class="rm-proj-bar">${bar}</div>
            <div class="rm-proj-stat-lbl" style="margin-top:3px">ระดับเสี่ยงรวม</div>
          </div>
        </div>
      </div>
      <div class="rm-proj-body">
        ${factors}
        ${canEdit ? `<button class="rm-proj-addbtn" onclick="openRiskFormForProject('${encodeURIComponent(proj)}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          เพิ่มปัจจัยเสี่ยงในโครงการนี้
        </button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function toggleProjectCard(encProj) {
  const proj = decodeURIComponent(encProj);
  _expandedProjects[proj] = !_expandedProjects[proj];
  renderRiskTable();
}

// Open the add form with project pre-filled
function openRiskFormForProject(encProj) {
  const proj = decodeURIComponent(encProj);
  openRiskForm();
  setTimeout(() => {
    const pEl = document.getElementById('riskProject');
    if (pEl && proj && proj !== '(ไม่ได้ระบุโครงการ)') {
      pEl.value = proj;
      onRiskProjectChange();
    }
  }, 150);
}

function getFilteredRisks() {
  const search   = (document.getElementById('rmSearch')?.value || '').toLowerCase();
  const level    = document.getElementById('rmFilterLevel')?.value   || '';
  const category = document.getElementById('rmFilterCategory')?.value|| '';
  const status   = document.getElementById('rmFilterStatus')?.value  || '';
  const strategy = document.getElementById('rmFilterStrategy')?.value|| '';
  const quarter  = document.getElementById('riskQuarterFilter')?.value|| '';
  return risks.filter(r => {
    const score = r.likelihood * r.impact;
    const lv = getRiskLevel(score).key;
    if (search && !r.name.toLowerCase().includes(search) && !(r.owner||'').toLowerCase().includes(search)) return false;
    if (level && lv !== level) return false;
    if (category && r.category !== category) return false;
    if (status && r.status !== status) return false;
    if (strategy && r.strategy !== strategy) return false;
    if (quarter && r.quarter && r.quarter !== 'all' && r.quarter !== quarter) return false;
    return true;
  });
}

function renderRiskTable() {
  updateRiskMetrics();
  buildRiskMatrix();
  buildCategoryBreakdown();

  const filtered = getFilteredRisks();
  const tbody    = document.getElementById('rmTableBody');
  const empty    = document.getElementById('rmEmptyState');
  const emptyMsg = document.getElementById('rmEmptyMsg');
  const flatView = document.getElementById('rmFlatView');
  const projView = document.getElementById('rmProjectView');
  if (!tbody) return;

  // Toggle which view is visible
  const isProject = riskView === 'project';
  if (flatView) flatView.style.display = isProject ? 'none' : 'block';
  if (projView) projView.style.display = isProject ? 'block' : 'none';

  // Empty handling
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    if (projView) projView.innerHTML = '';
    if (empty) empty.style.display = '';
    if (emptyMsg) emptyMsg.textContent = risks.length === 0 ? 'ยังไม่มีข้อมูลความเสี่ยง · กดปุ่ม "บันทึกความเสี่ยงใหม่" เพื่อเริ่มต้น' : 'ไม่พบความเสี่ยงที่ตรงกับเงื่อนไขค้นหา';
    renderRiskPagination(0);
    return;
  }
  if (empty) empty.style.display = 'none';

  if (isProject) {
    renderProjectView(filtered);
    renderRiskPagination(0); // pagination hidden in project view
    return;
  }

  const start = (rmCurrentPage - 1) * RM_PAGE_SIZE;
  const page  = filtered.slice(start, start + RM_PAGE_SIZE);

  tbody.innerHTML = page.map((r, idx) => {
    const score = r.likelihood * r.impact;
    const lv    = getRiskLevel(score);
    const stCls = { open:'open', inprogress:'inprogress', controlled:'controlled', closed:'closed' }[r.status] || 'open';
    const catCls= r.category || 'other';
    const canEdit = _isEditable();
    // Residual badge
    const resMap = {low:'🟢 ต่ำ', medium:'🟡 ปานกลาง', high:'🟠 สูง', veryhigh:'🔴 สูงมาก'};
    const resTxt = r.residual ? `<span class="rm-badge ${r.residual}">${resMap[r.residual]}</span>` : '<span style="color:var(--text3);font-size:11px">—</span>';
    // Due date with overdue highlight
    let dueTxt = '<span style="color:var(--text3);font-size:11px">—</span>';
    if (r.dueDate) {
      const due = new Date(r.dueDate);
      const today = new Date(); today.setHours(0,0,0,0);
      const overdue = due < today && r.status !== 'controlled' && r.status !== 'closed';
      const dueStr = due.toLocaleDateString('th-TH', {day:'numeric',month:'short',year:'2-digit'});
      dueTxt = `<span style="font-size:12px;color:${overdue?'var(--red)':'var(--text2)'};font-weight:${overdue?'700':'400'}">${overdue?'⚠️ ':''}${dueStr}</span>`;
    }
    return `<tr onclick="openRiskDetail(${r.id})" style="cursor:pointer">
      <td style="color:var(--text3);font-size:12px">${start + idx + 1}</td>
      <td>
        <div style="font-weight:600;font-size:13px;color:var(--text)">${r.name}</div>
        ${r.project ? `<div style="font-size:11px;color:var(--accent);margin-top:2px">📁 ${r.project}</div>` : ''}
        ${r.note ? `<div style="font-size:11px;color:var(--text3);margin-top:2px">📝 ${r.note}</div>` : ''}
      </td>
      <td><span class="rm-cat ${catCls}">${CAT_NAMES[r.category]||r.category}</span></td>
      <td style="font-size:12px;color:var(--text2)">${r.strategy ? (S_SHORT[r.strategy]||'-') : '—'}</td>
      <td style="text-align:center;font-size:14px;font-weight:700;color:var(--text2)">${r.likelihood}</td>
      <td style="text-align:center;font-size:14px;font-weight:700;color:var(--text2)">${r.impact}</td>
      <td class="rm-td-score" style="color:${lv.color}">${score}</td>
      <td><span class="rm-badge ${lv.key}">${lv.label}</span></td>
      <td>${resTxt}</td>
      <td><span class="rm-status ${stCls}">${STATUS_RM[r.status]||r.status}</span></td>
      <td style="font-size:12px;color:var(--text2);max-width:200px;white-space:pre-wrap;line-height:1.5">${r.control||'—'}</td>
      <td>${dueTxt}</td>
      <td style="font-size:12px;color:var(--text2)">${r.owner||'—'}</td>
      <td class="rm-td-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm" onclick="openRiskDetail(${r.id})" style="color:var(--s5);padding:4px 8px;font-size:12px" title="ดูรายละเอียด">👁️</button>
        ${canEdit ? `
        <button class="btn btn-sm" onclick="openRiskForm(${r.id})" style="color:var(--accent);padding:4px 8px;font-size:12px" title="แก้ไข">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="openRiskDelete(${r.id})" style="padding:4px 8px;font-size:12px" title="ลบ">🗑️</button>
        ` : ''}
      </td>
    </tr>`;
  }).join('');
  renderRiskPagination(filtered.length);
}

function renderRiskPagination(total) {
  const pag  = document.getElementById('rmPagination');
  const info = document.getElementById('rmPaginationInfo');
  const btns = document.getElementById('rmPaginationBtns');
  if (!pag) return;
  const totalPages = Math.ceil(total / RM_PAGE_SIZE);
  if (total <= RM_PAGE_SIZE) { pag.style.display = 'none'; return; }
  pag.style.display = '';
  const start = (rmCurrentPage - 1) * RM_PAGE_SIZE + 1;
  const end   = Math.min(rmCurrentPage * RM_PAGE_SIZE, total);
  if (info) info.textContent = `แสดง ${start}–${end} จาก ${total} รายการ`;
  let html = '';
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="btn btn-sm${p===rmCurrentPage?' btn-primary':''}" onclick="rmGotoPage(${p})">${p}</button>`;
  }
  if (btns) btns.innerHTML = html;
}

function rmGotoPage(p) {
  rmCurrentPage = p;
  renderRiskTable();
}

// ── Score preview in modal ──
function updateRiskScore() {
  const l = parseInt(document.getElementById('riskLikelihood')?.value || 3);
  const i = parseInt(document.getElementById('riskImpact')?.value || 3);
  const score = l * i;
  const lv = getRiskLevel(score);
  const lhEl = document.getElementById('riskLikelihoodVal');
  const imEl = document.getElementById('riskImpactVal');
  const numEl = document.getElementById('riskScoreNum');
  const lblEl = document.getElementById('riskScoreLabel');
  if (lhEl) lhEl.textContent = `${l} – ${LH_LABELS[l]||l}`;
  if (imEl) imEl.textContent = `${i} – ${IM_LABELS[i]||i}`;
  if (numEl) { numEl.textContent = score; numEl.style.color = lv.color; }
  if (lblEl) { lblEl.textContent = lv.label; lblEl.style.color = lv.color; }
  // Update formula hint
  const preview = document.getElementById('riskScorePreview');
  if (preview) {
    const hint = preview.querySelector('div:last-child');
    if (hint) hint.textContent = `โอกาส ${l} × ผลกระทบ ${i}`;
  }
  // Update slider gradient
  ['riskLikelihood','riskImpact'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const val = parseInt(el.value);
    const pct = (val - 1) / 4 * 100;
    el.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--border2) ${pct}%)`;
  });
}

// ── Open/Close Form Modal ──
function openRiskForm(id) {
  editingRiskId = id || null;
  populateRiskProjectList();
  const modal = document.getElementById('riskModalOverlay');
  const title = document.getElementById('riskModalTitle');
  if (!modal) return;
  if (id) {
    const r = risks.find(x => x.id === id);
    if (!r) return;
    title.textContent = '✏️ แก้ไขความเสี่ยง';
    document.getElementById('riskProject').value    = r.project     || '';
    document.getElementById('riskName').value        = r.name        || '';
    document.getElementById('riskCategory').value    = r.category    || '';
    document.getElementById('riskStrategy').value    = r.strategy    || '';
    document.getElementById('riskQuarter').value     = r.quarter     || 'all';
    document.getElementById('riskOwner').value       = r.owner       || '';
    document.getElementById('riskLikelihood').value  = r.likelihood  || 3;
    document.getElementById('riskImpact').value      = r.impact      || 3;
    document.getElementById('riskControl').value     = r.control     || '';
    document.getElementById('riskContingency').value = r.contingency || '';
    document.getElementById('riskStatus').value      = r.status      || 'open';
    document.getElementById('riskResidual').value    = r.residual    || '';
    document.getElementById('riskDueDate').value     = r.dueDate     || '';
    document.getElementById('riskReviewDate').value  = r.reviewDate  || '';
    document.getElementById('riskNote').value        = r.note        || '';
  } else {
    title.textContent = '🛡️ บันทึกความเสี่ยงใหม่';
    document.getElementById('riskProject').value     = '';
    document.getElementById('riskName').value        = '';
    document.getElementById('riskCategory').value    = '';
    document.getElementById('riskStrategy').value    = '';
    document.getElementById('riskQuarter').value     = 'all';
    document.getElementById('riskOwner').value       = '';
    document.getElementById('riskLikelihood').value  = 3;
    document.getElementById('riskImpact').value      = 3;
    document.getElementById('riskControl').value     = '';
    document.getElementById('riskContingency').value = '';
    document.getElementById('riskStatus').value      = 'open';
    document.getElementById('riskResidual').value    = '';
    document.getElementById('riskDueDate').value     = '';
    document.getElementById('riskReviewDate').value  = '';
    document.getElementById('riskNote').value        = '';
  }
  updateRiskScore();
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('riskProject')?.focus(), 120);
}

function closeRiskModal() {
  const modal = document.getElementById('riskModalOverlay');
  if (modal) modal.style.display = 'none';
  editingRiskId = null;
}

// ── Save Risk ──
function saveRisk() {
  const project  = (document.getElementById('riskProject')?.value || '').trim();
  const name     = (document.getElementById('riskName')?.value || '').trim();
  const category = document.getElementById('riskCategory')?.value || '';
  const strategy = document.getElementById('riskStrategy')?.value || '';
  const quarter  = document.getElementById('riskQuarter')?.value  || 'all';
  const owner    = (document.getElementById('riskOwner')?.value || '').trim();
  const likelihood = parseInt(document.getElementById('riskLikelihood')?.value || 3);
  const impact     = parseInt(document.getElementById('riskImpact')?.value     || 3);
  const control    = (document.getElementById('riskControl')?.value     || '').trim();
  const contingency= (document.getElementById('riskContingency')?.value || '').trim();
  const status   = document.getElementById('riskStatus')?.value || 'open';
  const residual = document.getElementById('riskResidual')?.value || '';
  const dueDate  = document.getElementById('riskDueDate')?.value || '';
  const reviewDate = document.getElementById('riskReviewDate')?.value || '';
  const note     = (document.getElementById('riskNote')?.value || '').trim();

  if (!name)     { showToast('⚠️ กรุณากรอกชื่อ/รายละเอียดความเสี่ยง'); return; }
  if (!category) { showToast('⚠️ กรุณาเลือกประเภทความเสี่ยง'); return; }

  const obj = { project, name, category, strategy, quarter, owner, likelihood, impact,
    control, contingency, status, residual, dueDate, reviewDate, note,
    lastEditedBy: _currentUser?.name || 'ผู้ใช้',
    lastEditedByPosition: _currentUser?.position || '',
    lastEditedAt: new Date().toISOString()
  };

  if (editingRiskId) {
    const idx = risks.findIndex(r => r.id === editingRiskId);
    if (idx >= 0) risks[idx] = { ...risks[idx], ...obj };
    showSavePopup('แก้ไขความเสี่ยงสำเร็จ!', `"${name}" อัปเดตข้อมูลเรียบร้อยแล้ว`);
    _autoSyncRisk('saveRisk', { data: JSON.stringify(risks[idx]) });
  } else {
    const newId = risks.length ? Math.max(...risks.map(r => r.id)) + 1 : 1;
    const newRisk = { id: newId, ...obj };
    risks.push(newRisk);
    showSavePopup('บันทึกความเสี่ยงสำเร็จ!', `"${name}" ได้รับการบันทึกในระบบแล้ว`);
    _autoSyncRisk('saveRisk', { data: JSON.stringify(newRisk) });
  }
  saveRisksToLocal();
  closeRiskModal();
  renderRiskTable();
}

// ── Delete ──
function openRiskDelete(id) {
  deleteRiskId = id;
  const r = risks.find(x => x.id === id);
  const nameEl = document.getElementById('riskDeleteName');
  if (nameEl && r) nameEl.textContent = r.name;
  const ov = document.getElementById('riskDeleteOverlay');
  if (ov) ov.style.display = 'flex';
}
function closeRiskDelete() {
  const ov = document.getElementById('riskDeleteOverlay');
  if (ov) ov.style.display = 'none';
  deleteRiskId = null;
}
function confirmDeleteRisk() {
  if (!deleteRiskId) return;
  const delId = deleteRiskId;
  risks = risks.filter(r => r.id !== delId);
  saveRisksToLocal();
  _autoSyncRisk('deleteRisk', { id: delId });
  closeRiskDelete();
  renderRiskTable();
  showToast('🗑️ ลบรายการความเสี่ยงแล้ว');
}

// ═══════════════════════════════════════════════════════
// RISK DETAIL / PREVIEW
// ═══════════════════════════════════════════════════════
let _detailRiskId = null;

function openRiskDetail(id) {
  const r = risks.find(x => x.id === id);
  if (!r) return;
  _detailRiskId = id;
  const score = r.likelihood * r.impact;
  const lv = getRiskLevel(score);
  const resMap = { low:'🟢 ต่ำ — ยอมรับได้', medium:'🟡 ปานกลาง — ต้องเฝ้าระวัง', high:'🟠 สูง — ต้องควบคุมเพิ่ม', veryhigh:'🔴 สูงมาก — ต้องเร่งจัดการ' };
  const stMap  = { open:'ยังไม่ดำเนินการ', inprogress:'กำลังดำเนินการ', controlled:'ควบคุมได้แล้ว', closed:'ปิดแล้ว' };
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'}) : '—';

  // Header
  document.getElementById('riskDetailTitle').textContent = r.name || '—';
  const projEl = document.getElementById('riskDetailProject');
  projEl.textContent = r.project ? ('📁 ' + r.project) : '';
  // Color header by level
  const hdr = document.getElementById('riskDetailHeader');
  hdr.style.borderLeft = `5px solid ${lv.color}`;

  const sFull = { '1':'ยุทธศาสตร์ที่ 1', '2':'ยุทธศาสตร์ที่ 2', '3':'ยุทธศาสตร์ที่ 3', '4':'ยุทธศาสตร์ที่ 4', '5':'งบบริหารสำนักงาน' };

  document.getElementById('riskDetailBody').innerHTML = `
    <!-- Score banner -->
    <div style="display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;background:var(--surface2);border-radius:var(--radius-lg);padding:1rem 1.25rem;margin-bottom:1.25rem;border:1px solid var(--border)">
      <div style="text-align:center">
        <div style="font-size:42px;font-weight:800;line-height:1;color:${lv.color}">${score}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">คะแนนความเสี่ยง</div>
      </div>
      <div>
        <span class="rm-badge ${lv.key}" style="font-size:13px;padding:5px 12px">${lv.label}</span>
        <div style="display:flex;gap:20px;margin-top:10px">
          <div><div style="font-size:11px;color:var(--text3)">โอกาส (Likelihood)</div><div style="font-size:18px;font-weight:700">${r.likelihood} / 5</div></div>
          <div style="border-left:1px solid var(--border);padding-left:20px"><div style="font-size:11px;color:var(--text3)">ผลกระทบ (Impact)</div><div style="font-size:18px;font-weight:700">${r.impact} / 5</div></div>
        </div>
      </div>
    </div>

    <!-- Info grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:1.25rem">
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">ประเภทความเสี่ยง</div><div><span class="rm-cat ${r.category||'other'}">${CAT_NAMES[r.category]||r.category||'—'}</span></div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">ยุทธศาสตร์</div><div style="font-weight:600;font-size:14px">${r.strategy ? (sFull[r.strategy]||'—') : '—'}</div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">สถานะการจัดการ</div><div><span class="rm-status ${r.status||'open'}">${stMap[r.status]||'—'}</span></div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">ความเสี่ยงคงเหลือหลังควบคุม</div><div style="font-weight:600;font-size:14px">${r.residual ? resMap[r.residual] : '—'}</div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">ผู้รับผิดชอบ</div><div style="font-weight:600;font-size:14px">${r.owner||'—'}</div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">ไตรมาส</div><div style="font-weight:600;font-size:14px">${r.quarter==='all'?'ตลอดทั้งปี':('ไตรมาส '+(r.quarter||'—'))}</div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">กำหนดวันแล้วเสร็จ</div><div style="font-weight:600;font-size:14px">${fmtDate(r.dueDate)}</div></div>
      <div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">วันที่ทบทวนล่าสุด</div><div style="font-weight:600;font-size:14px">${fmtDate(r.reviewDate)}</div></div>
    </div>

    <!-- Control measures -->
    <div style="margin-bottom:1rem">
      <div style="font-size:13px;font-weight:700;color:var(--text2);margin-bottom:6px;display:flex;align-items:center;gap:6px">🛡️ มาตรการควบคุม / แผนรับมือ</div>
      <div style="background:var(--green-light);border:1px solid #86efac;border-radius:var(--radius);padding:.875rem 1rem;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#14532d">${r.control || '— ยังไม่ได้ระบุ —'}</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="font-size:13px;font-weight:700;color:var(--text2);margin-bottom:6px;display:flex;align-items:center;gap:6px">🚨 แผนเผชิญเหตุ (Contingency Plan)</div>
      <div style="background:var(--amber-light);border:1px solid #f6cc70;border-radius:var(--radius);padding:.875rem 1rem;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#92400e">${r.contingency || '— ยังไม่ได้ระบุ —'}</div>
    </div>
    ${r.note ? `<div style="margin-bottom:.5rem"><div style="font-size:13px;font-weight:700;color:var(--text2);margin-bottom:6px">📝 หมายเหตุ</div><div style="font-size:14px;color:var(--text2);line-height:1.6">${r.note}</div></div>` : ''}
    ${r.lastEditedBy ? `<div style="font-size:11px;color:var(--text3);margin-top:1rem;border-top:1px solid var(--border);padding-top:8px">แก้ไขล่าสุดโดย: ${r.lastEditedBy}${r.lastEditedByPosition ? ' ('+r.lastEditedByPosition+')' : ''}${r.lastEditedAt ? ' · '+new Date(r.lastEditedAt).toLocaleString('th-TH') : ''}</div>` : ''}
  `;

  // edit button only for members
  const editBtn = document.getElementById('riskDetailEditBtn');
  if (editBtn) editBtn.style.display = _isEditable() ? '' : 'none';

  document.getElementById('riskDetailOverlay').style.display = 'flex';
}

function closeRiskDetail() {
  const ov = document.getElementById('riskDetailOverlay');
  if (ov) ov.style.display = 'none';
  _detailRiskId = null;
}

function editFromDetail() {
  const id = _detailRiskId;
  closeRiskDetail();
  if (id) openRiskForm(id);
}

// ═══════════════════════════════════════════════════════
// RISK PDF EXPORT
// ═══════════════════════════════════════════════════════

// Export the full risk report (matrix + table) to PDF
async function exportRiskReportPDF() {
  if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
    showToast('⚠️ ไม่พบไลบรารี PDF — ลองพิมพ์ผ่านเบราว์เซอร์แทน');
    window.print(); return;
  }
  showToast('⏳ กำลังสร้าง PDF รายงานความเสี่ยง...');
  try {
    const filtered = getFilteredRisks();
    const html = _buildRiskReportHTML(filtered);
    await _renderHTMLToPDF(html, 'r-risk-report-2569.pdf');
    showToast('✅ ดาวน์โหลด PDF แล้ว');
  } catch(err) {
    console.error(err);
    showToast('❌ สร้าง PDF ไม่สำเร็จ: ' + err.message);
  }
}

// Export a single risk's detail to PDF
async function exportSingleRiskPDF() {
  const r = risks.find(x => x.id === _detailRiskId);
  if (!r) return;
  showToast('⏳ กำลังสร้าง PDF...');
  try {
    const html = _buildSingleRiskHTML(r);
    await _renderHTMLToPDF(html, 'risk-' + r.id + '-2569.pdf');
    showToast('✅ ดาวน์โหลด PDF แล้ว');
  } catch(err) {
    console.error(err);
    showToast('❌ สร้าง PDF ไม่สำเร็จ: ' + err.message);
  }
}

// Shared renderer: build an off-screen element → html2canvas → jsPDF (A4 multi-page)
async function _renderHTMLToPDF(innerHTML, filename) {
  const holder = document.createElement('div');
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:32px;font-family:Sarabun,sans-serif;color:#1c2333';
  holder.innerHTML = innerHTML;
  document.body.appendChild(holder);

  const canvas = await html2canvas(holder, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  document.body.removeChild(holder);

  const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  const pdf = new jsPDFCtor('p', 'mm', 'a4');
  const pageW = 210, pageH = 297;
  const imgW = pageW;
  const imgH = canvas.height * imgW / canvas.width;
  let heightLeft = imgH;
  let position = 0;
  const imgData = canvas.toDataURL('image/jpeg', 0.92);
  pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
  heightLeft -= pageH;
  while (heightLeft > 0) {
    position -= pageH;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
    heightLeft -= pageH;
  }
  pdf.save(filename);
}

function _riskReportHeader(subtitle) {
  return `
    <div style="text-align:center;border-bottom:3px solid #dc2626;padding-bottom:16px;margin-bottom:20px">
      <div style="font-size:20px;font-weight:800;color:#1c2333">รายงานการบริหารความเสี่ยง</div>
      <div style="font-size:14px;color:#5a6477;margin-top:4px">มูลนิธิการศึกษาทางไกลผ่านดาวเทียม ในพระบรมราชูปถัมภ์</div>
      <div style="font-size:13px;color:#5a6477">ปีงบประมาณ พ.ศ. 2569 · ${subtitle}</div>
      <div style="font-size:11px;color:#9aa3b2;margin-top:6px">พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')}</div>
    </div>`;
}

function _buildRiskReportHTML(list) {
  const total = list.length;
  const high  = list.filter(r => r.likelihood*r.impact >= 10).length;
  const med   = list.filter(r => { const s=r.likelihood*r.impact; return s>=5&&s<10; }).length;
  const low   = list.filter(r => r.likelihood*r.impact < 5).length;
  const stMap = { open:'ยังไม่ดำเนินการ', inprogress:'กำลังดำเนินการ', controlled:'ควบคุมได้แล้ว', closed:'ปิดแล้ว' };
  const qf = document.getElementById('riskQuarterFilter')?.value || '';
  const qLabel = qf ? ('ไตรมาส '+qf) : 'ทุกไตรมาส';

  let rows = list.map((r, i) => {
    const score = r.likelihood * r.impact;
    const lv = getRiskLevel(score);
    return `<tr style="border-bottom:1px solid #e4e7ed">
      <td style="padding:7px 6px;font-size:11px;text-align:center">${i+1}</td>
      <td style="padding:7px 6px;font-size:11px">
        <b>${r.name||'—'}</b>${r.project?('<br><span style="color:#3b72f0;font-size:10px">📁 '+r.project+'</span>'):''}
      </td>
      <td style="padding:7px 6px;font-size:11px">${CAT_NAMES[r.category]||r.category||'—'}</td>
      <td style="padding:7px 6px;font-size:11px;text-align:center">${r.likelihood}×${r.impact}</td>
      <td style="padding:7px 6px;font-size:13px;font-weight:800;text-align:center;color:${lv.color}">${score}</td>
      <td style="padding:7px 6px;font-size:10px;text-align:center;color:${lv.color};font-weight:700">${lv.label}</td>
      <td style="padding:7px 6px;font-size:10px">${stMap[r.status]||'—'}</td>
      <td style="padding:7px 6px;font-size:10px">${r.control||'—'}</td>
      <td style="padding:7px 6px;font-size:10px">${r.owner||'—'}</td>
    </tr>`;
  }).join('');

  return _riskReportHeader(qLabel) + `
    <!-- summary boxes -->
    <div style="display:flex;gap:10px;margin-bottom:18px">
      <div style="flex:1;background:#eef2fd;border:1px solid #bfcff8;border-radius:8px;padding:10px;text-align:center"><div style="font-size:22px;font-weight:800;color:#3b72f0">${total}</div><div style="font-size:10px;color:#5a6477">ทั้งหมด</div></div>
      <div style="flex:1;background:#fff0f0;border:1px solid #f5a5a5;border-radius:8px;padding:10px;text-align:center"><div style="font-size:22px;font-weight:800;color:#dc2626">${high}</div><div style="font-size:10px;color:#5a6477">สูง/สูงมาก</div></div>
      <div style="flex:1;background:#fff8e6;border:1px solid #f6cc70;border-radius:8px;padding:10px;text-align:center"><div style="font-size:22px;font-weight:800;color:#d97706">${med}</div><div style="font-size:10px;color:#5a6477">ปานกลาง</div></div>
      <div style="flex:1;background:#e6f7ef;border:1px solid #86d9b0;border-radius:8px;padding:10px;text-align:center"><div style="font-size:22px;font-weight:800;color:#1a9a5c">${low}</div><div style="font-size:10px;color:#5a6477">ต่ำ</div></div>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e4e7ed">
      <thead>
        <tr style="background:#dc2626;color:#fff">
          <th style="padding:8px 6px;font-size:11px;text-align:center">#</th>
          <th style="padding:8px 6px;font-size:11px;text-align:left">ความเสี่ยง / โครงการ</th>
          <th style="padding:8px 6px;font-size:11px;text-align:left">ประเภท</th>
          <th style="padding:8px 6px;font-size:11px;text-align:center">L×I</th>
          <th style="padding:8px 6px;font-size:11px;text-align:center">คะแนน</th>
          <th style="padding:8px 6px;font-size:11px;text-align:center">ระดับ</th>
          <th style="padding:8px 6px;font-size:11px;text-align:left">สถานะ</th>
          <th style="padding:8px 6px;font-size:11px;text-align:left">มาตรการควบคุม</th>
          <th style="padding:8px 6px;font-size:11px;text-align:left">ผู้รับผิดชอบ</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="9" style="padding:20px;text-align:center;color:#9aa3b2">ไม่มีข้อมูล</td></tr>'}</tbody>
    </table>`;
}

function _buildSingleRiskHTML(r) {
  const score = r.likelihood * r.impact;
  const lv = getRiskLevel(score);
  const resMap = { low:'ต่ำ — ยอมรับได้', medium:'ปานกลาง — ต้องเฝ้าระวัง', high:'สูง — ต้องควบคุมเพิ่ม', veryhigh:'สูงมาก — ต้องเร่งจัดการ' };
  const stMap  = { open:'ยังไม่ดำเนินการ', inprogress:'กำลังดำเนินการ', controlled:'ควบคุมได้แล้ว', closed:'ปิดแล้ว' };
  const sFull = { '1':'ยุทธศาสตร์ที่ 1', '2':'ยุทธศาสตร์ที่ 2', '3':'ยุทธศาสตร์ที่ 3', '4':'ยุทธศาสตร์ที่ 4', '5':'งบบริหารสำนักงาน' };
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'}) : '—';
  const cell = (label, val) => `<div style="padding:8px 0;border-bottom:1px solid #eef0f3"><div style="font-size:11px;color:#9aa3b2">${label}</div><div style="font-size:13px;font-weight:600;margin-top:2px">${val}</div></div>`;

  return _riskReportHeader('แบบรายงานความเสี่ยงรายการ') + `
    <div style="background:${lv.color}15;border:2px solid ${lv.color};border-radius:10px;padding:16px;margin-bottom:18px">
      <div style="font-size:16px;font-weight:800;color:#1c2333;line-height:1.4">${r.name||'—'}</div>
      ${r.project?('<div style="font-size:12px;color:#3b72f0;margin-top:4px">📁 '+r.project+'</div>'):''}
      <div style="display:flex;align-items:center;gap:20px;margin-top:12px">
        <div style="text-align:center"><div style="font-size:34px;font-weight:800;color:${lv.color};line-height:1">${score}</div><div style="font-size:10px;color:#5a6477">คะแนน</div></div>
        <div style="font-size:14px;font-weight:700;color:${lv.color}">${lv.label}</div>
        <div style="font-size:12px;color:#5a6477">โอกาส ${r.likelihood}/5 × ผลกระทบ ${r.impact}/5</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;margin-bottom:16px">
      ${cell('ประเภทความเสี่ยง', CAT_NAMES[r.category]||r.category||'—')}
      ${cell('ยุทธศาสตร์', r.strategy?(sFull[r.strategy]||'—'):'—')}
      ${cell('สถานะการจัดการ', stMap[r.status]||'—')}
      ${cell('ความเสี่ยงคงเหลือหลังควบคุม', r.residual?resMap[r.residual]:'—')}
      ${cell('ผู้รับผิดชอบ', r.owner||'—')}
      ${cell('ไตรมาส', r.quarter==='all'?'ตลอดทั้งปี':('ไตรมาส '+(r.quarter||'—')))}
      ${cell('กำหนดวันแล้วเสร็จ', fmtDate(r.dueDate))}
      ${cell('วันที่ทบทวนล่าสุด', fmtDate(r.reviewDate))}
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:13px;font-weight:700;color:#1a9a5c;margin-bottom:5px">🛡️ มาตรการควบคุม / แผนรับมือ</div>
      <div style="background:#e6f7ef;border:1px solid #86d9b0;border-radius:8px;padding:12px;font-size:13px;line-height:1.7;white-space:pre-wrap;color:#14532d">${r.control||'— ยังไม่ได้ระบุ —'}</div>
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:5px">🚨 แผนเผชิญเหตุ (Contingency Plan)</div>
      <div style="background:#fff8e6;border:1px solid #f6cc70;border-radius:8px;padding:12px;font-size:13px;line-height:1.7;white-space:pre-wrap;color:#92400e">${r.contingency||'— ยังไม่ได้ระบุ —'}</div>
    </div>
    ${r.note?('<div style="font-size:12px;color:#5a6477;line-height:1.6"><b>หมายเหตุ:</b> '+r.note+'</div>'):''}`;
}

// ─ Expose to auth update (show add button after login) ──
const _origApplyAuthUI = typeof _applyAuthUI === 'function' ? _applyAuthUI : null;

// ── Firebase config ──────────────────────────────────────────
(function(){
  var firebaseConfig = {
    apiKey:            "AIzaSyD2D_fOMOXaHFsRCtTOObEN-fJ5tXy12hg",
    authDomain:        "resig-25226.firebaseapp.com",
    projectId:         "resig-25226",
    storageBucket:     "resig-25226.firebasestorage.app",
    messagingSenderId: "84231645157",
    appId:             "1:84231645157:web:97b713f3d4cafab4d6310c"
  };
  if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }

  // ── Login (Firebase → GAS → Local) ──────────────────────
  window.authLogin = async function() {
    const email = (document.getElementById('loginEmail').value || '').trim().toLowerCase();
    const pass  = document.getElementById('loginPassword').value || '';
    const errEl = document.getElementById('loginError');
    const btn   = document.getElementById('loginSubmitBtn');
    errEl.classList.remove('show');
    if (!email || !pass) { errEl.textContent = 'กรุณากรอกอีเมลและรหัสผ่าน'; errEl.classList.add('show'); return; }
    btn.disabled = true; btn.textContent = '⏳ กำลังตรวจสอบ...';
    const hash = _hashSimple(pass);

    // 1. Firebase Auth
    try {
      const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
      const uid  = cred.user.uid;
      let fullname = email, position = '', dept = '';
      try {
        const doc = await firebase.firestore().collection('members').doc(uid).get();
        if (doc.exists) {
          fullname = doc.data().fullname || email;
          position = doc.data().position || '';
          dept     = doc.data().dept     || '';
        }
      } catch(e) {}
      const userObj = { id:uid, name:fullname, email, uid, isGuest:false, position, dept };
      _setLoggedIn(userObj);
      closeAuthModal();
      _showLoginSuccess(fullname, position, dept);
      btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ';
      return;
    } catch(err) {
      const m = err.code;
      let msg = '❌ เกิดข้อผิดพลาด';
      if (m==='auth/user-not-found'||m==='auth/invalid-credential') msg = '❌ Email หรือรหัสผ่านไม่ถูกต้อง';
      else if (m==='auth/wrong-password')    msg = '❌ รหัสผ่านไม่ถูกต้อง';
      else if (m==='auth/invalid-email')     msg = '❌ รูปแบบอีเมลไม่ถูกต้อง';
      else if (m==='auth/too-many-requests') msg = '❌ ลองใหม่อีกครั้งในภายหลัง';
      if (!m || m === 'auth/network-request-failed') { /* fallthrough to GAS */ }
      else { errEl.textContent = msg; errEl.classList.add('show'); btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ'; return; }
    }

    // 2. GAS fallback
    if (_gasReady()) {
      try {
        const res = await _gasAuthCall({ action:'loginUser', email, passwordHash:hash });
        if (res.success) {
          _localSyncUser({ id:res.user.id, name:res.user.name, email:res.user.email, passwordHash:hash, position:res.user.position||'', dept:res.user.dept||'' });
          _setLoggedIn({ id:res.user.id, name:res.user.name, email:res.user.email, isGuest:false, position:res.user.position||'', dept:res.user.dept||'' });
          closeAuthModal();
          _showLoginSuccess(res.user.name, res.user.position||'', res.user.dept||'');
          btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ'; return;
        } else {
          errEl.textContent = res.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
          errEl.classList.add('show'); btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ'; return;
        }
      } catch(e) { console.warn('GAS login unavailable, trying local:', e.message); }
    }

    // 3. Local cache สุดท้าย
    const localRes = _localLogin(email, hash);
    if (localRes.success) {
      _setLoggedIn({ id:localRes.user.id, name:localRes.user.name, email:localRes.user.email, isGuest:false, position:localRes.user.position||'', dept:localRes.user.dept||'' });
      closeAuthModal();
      _showLoginSuccess(localRes.user.name, localRes.user.position||'', localRes.user.dept||'', true);
    } else {
      errEl.textContent = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'; errEl.classList.add('show');
    }
    btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ';
  };

  // ── Register (Firebase → GAS → Local) ───────────────────
  window.fbRegisterSubmit = async function() {
    const name     = (document.getElementById('fbRegName').value     || '').trim();
    const position = (document.getElementById('fbRegPosition').value || '').trim();
    const dept     = document.getElementById('fbRegDept').value;
    const email    = (document.getElementById('fbRegEmail').value    || '').trim().toLowerCase();
    const password = document.getElementById('fbRegPassword').value;
    const confirm  = document.getElementById('fbRegConfirm').value;
    const errEl    = document.getElementById('fbRegError');
    errEl.style.display = 'none';

    if (!name||!position||!dept||!email||!password||!confirm) {
      errEl.textContent = '⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง'; errEl.style.display = 'block'; return;
    }
    if (password.length < 6) { errEl.textContent = '⚠️ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'; errEl.style.display = 'block'; return; }
    if (password !== confirm) { errEl.textContent = '⚠️ รหัสผ่านไม่ตรงกัน'; errEl.style.display = 'block'; return; }

    const btn = document.getElementById('fbRegSubmitBtn');
    btn.disabled = true; btn.textContent = '⏳ กำลังสมัครสมาชิก...';

    // 1. Firebase Auth
    try {
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const uid  = cred.user.uid;
      await firebase.firestore().collection('members').doc(uid).set({
        fullname: name, position, dept, email, uid,
        year: 2569,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      document.getElementById('fbRegFormSection').style.display    = 'none';
      document.getElementById('fbRegSuccessSection').style.display = 'flex';
      document.getElementById('fbRegSuccessMsg').innerHTML =
        '<strong>' + name + '</strong><br>' + email + '<br>ตำแหน่ง: ' + position + '<br>สังกัด: ' + dept +
        '<br><br><small style="color:var(--text3)">สามารถใช้ Email + Password นี้ Login ได้เลยครับ</small>';
      btn.disabled = false; btn.textContent = '✅ ลงทะเบียนสมาชิก';
      return;
    } catch(err) {
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = '❌ อีเมลนี้ถูกใช้งานแล้ว';
      if (err.code === 'auth/invalid-email')        msg = '❌ รูปแบบอีเมลไม่ถูกต้อง';
      if (err.code === 'auth/weak-password')        msg = '❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
      if (err.code !== 'auth/network-request-failed') {
        errEl.textContent = msg; errEl.style.display = 'block';
        btn.disabled = false; btn.textContent = '✅ ลงทะเบียนสมาชิก'; return;
      }
    }

    // 2. GAS / Local fallback
    const hash = _hashSimple(password);
    const localRes = _localRegister(name, email, hash, position, dept);
    if (localRes.success) {
      document.getElementById('fbRegFormSection').style.display    = 'none';
      document.getElementById('fbRegSuccessSection').style.display = 'flex';
      document.getElementById('fbRegSuccessMsg').innerHTML =
        '<strong>' + name + '</strong><br>' + email +
        '<br><br><small style="color:var(--amber)">⚠️ บันทึกเฉพาะในเครื่องนี้ — กรุณาแจ้งผู้ดูแลระบบ</small>';
    } else {
      errEl.textContent = '❌ ' + localRes.message; errEl.style.display = 'block';
    }
    btn.disabled = false; btn.textContent = '✅ ลงทะเบียนสมาชิก';
  };

  // ── Reset form หลังลงทะเบียนสำเร็จ ─────────────────────
  window.fbRegReset = function() {
    ['fbRegName','fbRegPosition','fbRegEmail','fbRegPassword','fbRegConfirm'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fbRegDept').value = '';
    document.getElementById('fbRegError').style.display = 'none';
    document.getElementById('fbRegSuccessSection').style.display = 'none';
    document.getElementById('fbRegFormSection').style.display    = 'flex';
    const btn = document.getElementById('fbRegSubmitBtn');
    btn.disabled = false; btn.textContent = '✅ ลงทะเบียนสมาชิก';
  };

  // ── รอ Firebase resolve auth state (ป้องกัน race condition) ──
  let _authResolved = false;
  firebase.auth().onAuthStateChanged(async function(user) {
    if (_authResolved) return;
    _authResolved = true;

    if (user) {
      let fullname = user.displayName || user.email;
      let position = '', dept = '';
      try {
        const doc = await firebase.firestore().collection('members').doc(user.uid).get();
        if (doc.exists) {
          fullname = doc.data().fullname || user.email;
          position = doc.data().position || '';
          dept     = doc.data().dept     || '';
        }
      } catch(e) {}
      _setLoggedIn({ id:user.uid, name:fullname, email:user.email, uid:user.uid, isGuest:false, position, dept });
    } else {
      // ถ้า _currentUser เป็น guest → ไม่ต้องทำอะไร
      if (_currentUser && _currentUser.isGuest) return;
      _currentUser = null;
      _saveSession(null);
      if (typeof _applyAuthUI === 'function') _applyAuthUI();
      setTimeout(() => {
        if (!_currentUser && typeof openAuthModal === 'function') openAuthModal('login');
      }, 300);
    }
  });
})();
