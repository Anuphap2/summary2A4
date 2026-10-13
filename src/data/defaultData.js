export const initialPagesData = [
  {
    id: 'page-1',
    pageNumber: 1,
    title: 'สรุปสอบปลายภาค - หน้า 1 (Pattern Recognition, Robotics & คลื่นแสงและระบบสี)',
    subtitle: 'สรุปอัดแน่น A4 3 คอลัมน์ คั่นด้วย | และสีไฮไลท์ ตรงตามสไลด์และแนวข้อสอบจริง',
    tagColor: 'lilac',
    accentColor: '#4338ca',
    columns: 3,
    layoutMode: 'cheatsheet',
    cardStyle: 'cheatsheet',
    cards: [
      {
        id: 'card-ch9',
        title: 'บทที่ 9: ก.รู้จำรูปแบบ (Pattern Recognition) & Abstraction',
        tag: 'Pattern & CT',
        colorTheme: 'lilac',
        content: `<b>นิยาม:</b> ศาสตร์จำแนกวัตถุ (Objects) เข้าสู่ประเภท (Classes) ตามรูปร่าง/ลักษณะเด่น โดยใช้เทคนิค ก.ประมวลผลสัญญาณ AI และสถิติ | <b>ลักษณะเด่น (Features):</b> ข้อมูลสกัดส่งให้ตัวแยกประเภท | <b>Classifier (ตัวแยกประเภท):</b> <mark style="background-color: #fef08a;">Supervised (มีผู้สอน รู้ประเภทล่วงหน้า มี Label ใน Training Data)</mark> | <mark style="background-color: #bbf7d0;">Unsupervised (ไม่มีผู้สอน จัดกลุ่มตาม ค.คล้าย เรียกว่า Clustering)</mark> | <b>Feature Extraction:</b> ก.สกัดลักษณะเด่นเพื่อระบุ Class | <b>Feature Selection:</b> ขบวนการเลือกลักษณะเด่นที่ดีที่สุดเพื่อให้แม่นยำสูงสุด | <b>Label (ลาเบล):</b> ป้ายชื่อคลาส/คำตอบที่ถูกต้อง | <b>ตัวอย่างสไลด์:</b> เมาส์คอมฯ (ภายนอกต่างกัน เช่น เมาส์เกมมิ่ง/logi/คิตตี้ แต่ ก.ใช้งานเหมือนกันคือเลื่อนตัวชี้และคลิก) | <b>เกมการ์ดดอกไม้:</b> ใบเลี้ยงเดี่ยว (เส้นใบขนาน กลีบดอก 3 หรือทวีคูณของ 3) | ใบเลี้ยงคู่ (เส้นใบร่างแห กลีบดอก 4–5 หรือทวีคูณของ 4–5) | <b>ค้นหาสมุด 100 เล่ม:</b> ตรวจเล่มบนสุด เจอปุ๊บหยิบจบ ไม่เจอหาใน 99 เล่มที่เหลือ ขนาดปัญหาลดลงเรื่อยๆ | <b>Abstraction (ก.คิดเชิงนามธรรม):</b> <mark style="background-color: #fed7aa;">คัดแยกเฉพาะคุณลักษณะสำคัญ ตัดรายละเอียดปลีกย่อยทิ้ง สร้างแบบจำลอง (Model)</mark> | <b>ตัวอย่างสไลด์ 16:</b> High Cable Chest Press ยกน้ำหนัก สนใจเฉพาะ "ระบบรอก และสายเคเบิล" ตัดคนยก และฉากหลังฟิตเนสทิ้งทั้งหมด | <b>4 เสาหลัก Computational Thinking (CT):</b> 1) <b>Decomposition:</b> แตกปัญหาใหญ่เป็นย่อย (คิดวิเคราะห์) | 2) <b>Pattern Recognition:</b> หาแบบแผน ค.เหมือน/ต่าง แนวโน้ม | 3) <b>Abstraction:</b> คัดแก่นแท้ ตัดสิ่งไม่จำเป็น สร้าง Model (คิดสังเคราะห์) | 4) <b>Algorithm Design:</b> ลำดับขั้นตอนวิธี (Flowchart / Project planning สร้างตึก) | <b>ตัวอย่างรถยนต์ของตะวัน:</b> ปัญหา 2 ประการ (ยางแบน + วิ่งช้าเพราะน้ำมันใกล้หมด) → Decomposition (ยางแบน, น้ำมันหมด) → Pattern (จัดการยางก่อน เพราะน้ำมันเหลือไม่พอขับไปปั๊ม) → Abstraction (ต้องเปลี่ยนยางอะไหล่) → Algorithm Design (หมุนบล็อกคลายน็อต → แม่แรงยกรถ → ถอดน็อต → ถอดล้อเปลี่ยนล้ออะไหล่ → ใส่น็อตปล่อยแม่แรง → ขันน็อตแน่น) | <b>ระบบตรวจจับใบหน้า:</b> Viola-Jones (2001 พอล วีโอลา & ไมเคิล โจนส์) ใน OpenCV cvHaarDetectObjects() ใช้ Patch Model & Grid Geometry ตรวจจมูกและตาสองข้างในรูปเมตริกซ์แนวตั้ง/แนวนอน สู่ Face ID | <b>ก.คำนวณ k-NN (Nearest Neighbors):</b> [formula]สูตร Euclidean Distance: d = √( Σ(pᵢ - qᵢ)² ) = √( (x₂ - x₁)² + (y₂ - y₁)² )[/formula] | <b>ตัวอย่างคำนวณในสไลด์ 25–26:</b> จุดทดสอบ q(4, 2) เทียบจุดข้อมูลฝึกสอน: p₁(5, 4) → [formula]d₁ = √( (4-5)² + (2-4)² ) = √5 ≈ 2.236[/formula] | p₂(4, 4) → [formula]d₂ = √( (4-4)² + (2-4)² ) = √4 = 2[/formula] | p₃(3, 3) → [formula]d₃ = √( (4-3)² + (2-3)² ) = √2 ≈ 1.414[/formula] | p₄(2, 1) → [formula]d₄ = √( (4-2)² + (2-1)² ) = √5 ≈ 2.236[/formula] | <b>กฎการตัดสิน:</b> 1-NN ดู d ต่ำสุด 1 จุด (ตอบตาม p₃) | 3-NN ดู d ต่ำสุด 3 ลำดับแรก (p₃, p₂, p₁/p₄) แล้วทำ Majority Vote (เสียงข้างมาก) | <b>ตารางสัตว์ปริศนา 7 ชนิดในสไลด์:</b> กบ (ครึ่งบกครึ่งน้ำ), ปลาหมอ (ปลา), จระเข้ (เลื้อยคลาน), ปลาทอง (ปลา), เต่า (เลื้อยคลาน), สุนัข (เลี้ยงลูกด้วยนม), นกกระจอกเทศ (นก) | <mark style="background-color: #fbcfe8;">⚠️ อาจารย์เน้นออกสอบ: ในห้องสอนตารางสัตว์ปริศนา แต่ข้อสอบจริงเปลี่ยนเป็น "ภาพยนตร์/หนังในโรง" (แนวหนัง Action x, Drama y, ความยาว, เรตติ้ง) ใช้สูตร Euclidean เดียวกัน!</mark>`
      },
      {
        id: 'card-ch8-10-11',
        title: 'บทที่ 8, 10, 11: ศาสตร์หุ่นยนต์ (Robotics)',
        tag: 'หุ่นยนต์',
        colorTheme: 'mint',
        content: `<b>นิยาม RIA:</b> สถาบันหุ่นยนต์อเมริกา นิยามว่า เครื่องจักรกล ใช้งานแทนมนุษย์ ออกแบบให้ตั้งลำดับงานได้หลากหลายหน้าที่ เคลื่อนย้ายวัสดุอุปกรณ์ตามโปรแกรม | <b>ศัพท์หุ่นยนต์ที่สั่งค้นเพิ่ม:</b> <b>Humanoid:</b> รูปร่างเหมือนมนุษย์ มีหัว แขน ขา เช่น ASIMO | <b>Actroid:</b> หุ่นยนต์เสมือนมนุษย์จริง ผิวซิลิโคน กะพริบตา พูดจา ขยับสีหน้าเหมือนคนจริง | <b>Cyborg:</b> ไซบอร์ก สิ่งมีชีวิต/มนุษย์ที่มี ก.เสริมอวัยวะกลไกอิเล็กทรอนิกส์ | <b>Nanorobot:</b> ขนาดนาโนเมตร 10⁻⁹ ม. ใช้ระดับเซลล์/การแพทย์ | <b>5 องค์ประกอบพื้นฐาน:</b> 1) <b>Mechanical:</b> เครื่องจักรกล/โครงสร้างฮาร์ดแวร์ | 2) <b>Power:</b> แหล่งพลังงาน/กำลังขับเคลื่อน | 3) <b>Sensor:</b> ส่วนรับรู้ (ตา-กล้อง/IR/รังสี, หู-ไมค์, ลิ้น/จมูก-เคมี, ผิวหนัง-กระทบ; นอกเหนือจากมนุษย์: Echolocation เสียง, Electroception สนามไฟฟ้า, Magnetoception สนามแม่เหล็ก) | 4) <b>Actuator/Effector:</b> ส่วนกระทำตอบสนอง (มือกล, แขนกล, ขา, ล้อ) | 5) <b>Intelligent:</b> ปัญญาประดิษฐ์ (ANN, Fuzzy, GA, Search) | <b>Closed Loop:</b> Sensor (รับข้อมูล) → คิดและตัดสินใจ → Effector (ตอบสนอง) → สภาพแวดล้อม → Sensor | <b>สถาปัตยกรรมระบบควบคุม:</b> <mark style="background-color: #fed7aa;">Reactive Control (ไร้ AI, Sensor/Effector Mapping ทันที, ตอบสนองไว เหมาะกับ Dynamic แต่ไร้ ค.จำ ไม่คิดซับซ้อน)</mark> | <mark style="background-color: #bbf7d0;">Subsumption Architecture (มี AI, คิด วางแผน บันทึกข้อมูล แก้ปัญหาเฉพาะหน้า มีประสบการณ์เรียนรู้)</mark> | <b>ภาษาโปรแกรมหุ่นยนต์:</b> <b>Behavior Language:</b> (Rodney Brooks 1990 Rule-Based คุม Subsumption แบบ Real-Time) | <b>GRL:</b> (Horswill 2000 Functional บน Finite State Machine) | <b>ALisp:</b> (Andre & Russell 2002 พัฒนาจาก Lisp เรียนรู้จากสภาพแวดล้อม) | <b>LAMA:</b> (MIT ประกอบกลไก), RAPT (Edinburg), Karel/Karel++ (OOP) | <b>ก.แบ่งประเภทตามกายภาพ:</b> <b>Fixed Robot:</b> ติดตั้งอยู่กับที่ เช่น แขนกล Robotic Arm, Cylindrical Robot รุ่น BC201 พ่นสี เชื่อมโลหะ จัดเรียงกระสอบ | <b>Mobile Robot:</b> (ล้อ: เร็วบนพื้นราบ ควบคุมง่าย แต่ข้ามสิ่งกีดขวางยาก | สายพาน: ลุยพื้นที่ขรุขระ/ต่างระดับ ตะกุยพื้น ช้า เสี่ยงทำลายพื้นผิว | ขา: 2 หรือ 4 ขา ไปได้ทุกพื้นผิว ข้ามสิ่งกีดขวาง ทรงตัวยาก | บิน: เร็ว สำรวจพื้นที่เสี่ยง | ในน้ำ: ใบพัด/ครีบ ถังอับเฉา โซนาร์ | งู: บิดข้อต่อ ขึ้นที่สูง เข้าที่แคบ ข้อต่อเปลี่ยนแทนกันได้ | SuperBot: ปรับเปลี่ยนรูปทรงได้) | <b>ท่าการเคลื่อนที่ Gait 4 ขา:</b> Trot (กึ่งเดินกึ่งวิ่ง), Pace (เดิน), Bound (กระโดด) | <b>จุดสมดุล (Equilibrium):</b> Stable (เสถียร), Asymptotically stable (เสถียรแบบลู่เข้าสู่จุดสมดุล), Unstable (ไม่เสถียร) | <b>หุ่นยนต์ในสไลด์:</b> ASIMO (Honda 2 ขา สำรวจพื้นที่แคบ/ดวงจันทร์), MOTOMAN (กุ๊ก เสิร์ฟ รินน้ำ ทำความสะอาด), Foster-Miller (หุ่นสังหาร/หาทุ่นระเบิดใต้น้ำ ริมฝั่ง), PaPeRo (พาเพโร่ ดูแลเด็กอนุบาล ส่ง SMS รายงาน), หุ่นยนต์ปลา (เซ็นเซอร์เคมี ตรวจมลพิษ ว่ายประหยัดพลังงาน) | <b>วงการหุ่นยนต์ไทย:</b> <mark style="background-color: #fef08a;">หุ่นยนต์คุณหมอพระราชทาน (2497): ร.9 พระราชทานทุน 20,000 บ. ให้ อ.สนั่น สุมิตร (วท.เทคนิคกรุงเทพฯ) สร้างตัวแรกของโลกขนาดเท่าคนจริง แต่งกายชุดหมอ เดิน ไหว้ พูด ฟัง โต้ตอบได้</mark> | FIBO (มจธ.: หุ่นเดิน 2 ขา, Crop Collector เก็บหางเหล็กร้อนสยามยามาโตะ) | มหิดล (Thai-XPole ขั้วโลกใต้, ระบบนำทางผ่าตัด) | AIT (หุ่นบินอัตโนมัติ, Exoskeleton ชุดสวมแขนขาช่วยผู้พิการ) | จุฬาฯ (3D Cobot แขนกล 3 องศาอิสระเชิงเส้นแกน X, Y, Z) | มจธ. (คุมแขนกลด้วยสัญญาณไฟฟ้าชีวภาพใบหน้า: กลอกตา ยักคิ้ว)`
      },
      {
        id: 'card-ch13-1',
        title: 'บทที่ 13-1: ฟิสิกส์คลื่นแสง & ระบบสี',
        tag: 'คลื่น & สี',
        colorTheme: 'coral',
        content: `<b>สูตรคลื่น & แสง:</b> [formula]V = f · λ  ⇐⇒  f = V/λ , λ = V/f , T = 1/f , f = 1/T[/formula] | <b>ความเร็วแสง (V):</b> สุญญากาศ/อากาศ = [formula]3 × 10⁸ m/s[/formula] (176,000 ไมล์/วิ) | ในแก้ว/พลาสติก = [formula]2 × 10⁸ m/s[/formula] (เกิดการหักเห ดรรชนีหักเห → ประโยชน์: เลนส์กล้อง ซูมเข้า ซูมออก) | <b>Visible Light (แสงที่ตามองเห็น):</b> <mark style="background-color: #bae6fd;">ความยาวคลื่น 400 – 700 nm (400 nm ม่วง/น้ำเงิน, 700 nm แดง)</mark> | <b>ค.ถี่สูงกว่าม่วง:</b> UV, X-Rays, Gamma Rays | <b>ต่ำกว่าแดง:</b> Infrared, Micro, Radio | <b>SI Units:</b> Nano (10⁻⁹), Micro (10⁻⁶), Milli (10⁻³), Kilo (10³), Mega (10⁶), Giga (10⁹), Tera (10¹²) | <b>วัตถุและการสะท้อนแสง:</b> วัตถุสีแดง สะท้อนแดง ดูดกลืนสีอื่น | วัตถุดำดูดกลืนทุกสี | วัตถุขาวสะท้อนทุกสี | โปร่งใส (ผ่านเป็นระเบียบ เช่น น้ำใส แก้วใส) | โปร่งแสง (ผ่านกระเจิง เช่น กระจกฝ้า น้ำขุ่น) | ทึบแสง (ผ่านไม่ได้ ดูดกลืน/สะท้อน เช่น กระจกเงา ผนังตึก) | <b>เซลล์ในเรตินา (Retina):</b> <mark style="background-color: #fef08a;">Rods (ไวแสง รับ ค.สว่าง ขาว-ดำ)</mark> | <mark style="background-color: #bbf7d0;">Cones (รับสี หนาแน่นที่ Central Fovea มี 3 ชนิด: S น้ำเงิน พีค ~430 nm, M เขียว พีค ~560 nm, L แดง พีค ~610 nm | ตาบอดสีเกิดจาก Cone ชนิดใดชนิดหนึ่งบกพร่อง)</mark> | <b>Dominant Wavelength:</b> กำหนด Hue (เนื้อสี) | <b>Luminance:</b> [formula]กำลังส่องสว่าง/พื้นที่ใต้กราฟ: L = (D - A)B + AW[/formula] | <b>Saturation:</b> [formula]ค.อิ่มตัวสี/ค.บริสุทธิ์: S = (D - A)B / L[/formula] | <b>ระบบสี (Color Models):</b> <mark style="background-color: #bae6fd;">Additive (สีของแสง): แม่สี RGB รวม=ขาว ไร้แสง=ดำ (จอภาพ)</mark> | <mark style="background-color: #fed7aa;">Subtractive (สารสี/หมึก): แม่สี CMYK รวม=ดำ ไร้หมึก=ขาว (งานพิมพ์)</mark> | <b>HSB/HSL:</b> Hue (เนื้อสี 0–360°), Saturation (ค.สด), Brightness/Lightness | <b>Lab Color:</b> L (สว่าง 0–100), a (เขียว-แดง), b (น้ำเงิน-เหลือง) | <b>CIE Diagram:</b> [formula]X + Y + Z = 1  ⇒  x = X/(X+Y+Z) , y = Y/(X+Y+Z)[/formula] | <b>Color Gamut:</b> จอ Monitor มี Gamut กว้างกว่าเครื่องพิมพ์ Printer จึงพิมพ์สีไม่ครบตามที่เห็นบนจอ`
      }
    ]
  },
  {
    id: 'page-2',
    pageNumber: 2,
    title: 'สรุปสอบปลายภาค - หน้า 2 (ภาพดิจิทัล, โครงข่ายประสาท, ระบบผู้เชี่ยวชาญ & วันสอบ)',
    subtitle: 'สรุปอัดแน่น A4 3 คอลัมน์ คั่นด้วย | และสีไฮไลท์ ตรงตามสไลด์และแนวข้อสอบจริง',
    tagColor: 'mint',
    accentColor: '#059669',
    columns: 3,
    layoutMode: 'cheatsheet',
    cardStyle: 'cheatsheet',
    cards: [
      {
        id: 'card-ch13-2',
        title: 'บทที่ 13-2 to 13-4: ภาพดิจิทัล & ก.ประมวลผล',
        tag: 'ภาพดิจิทัล',
        colorTheme: 'cream',
        content: `<b>Bitmap vs Vector:</b> <b>Bitmap (Raster):</b> จุดพิกเซล สีสมจริง ไล่โทนเนียน ขยายแล้วแตก Pixelated เปลืองหน่วยความจำ | <b>Vector:</b> สมการคณิตศาสตร์/เรขาคณิต ขยายไม่แตก ไฟล์เล็ก เหมาะกับโลโก้/แบบแปลน | <b>สัญญาณ & ก.แปลงเป็นดิจิทัล (A/D):</b> Analog (ต่อเนื่อง) → Discrete-time → Digital (จำกัดระดับ) | 1. <b>Signal Sampling: Nyquist Theorem:</b> [formula]fₛ ≥ 2·fₘₐₓ[/formula] (ค.ถี่สุ่มต้อง ≥ 2 เท่าของ ค.ถี่สูงสุด ป้องกัน Aliasing ภาพเพี้ยน/ลายคลื่น) | <b>ตัวอย่างสไลด์ Nyquist:</b> สัญญาณ 5 Hz | สุ่ม 10 Hz (fₛ = 2f) ได้รูปฟันเลื่อย ใกล้เคียงต้นฉบับ | สุ่ม 100 Hz (Oversampling) ได้คลื่นโคไซน์สมบูรณ์เหมือนจริง | สุ่ม 9 Hz (Undersampling < 2f) เกิด Aliasing คลื่นผิดเพี้ยนไปจากเดิม | 2. <b>Quantization:</b> กำหนดระดับความเข้มเทา ปัดเศษเป็น Integer | ระดับเทา (Gray Level 8-bit = 256 ระดับ 0=ดำ ถึง 255=ขาว) | <b>ประเภทบิตแมป 4 ชนิด:</b> <b>Binary ขาวดำ:</b> 1 บิต/พิกเซล (0=ดำ, 1=ขาว ตัวอักษร ลายนิ้วมือ) | <b>Grayscale:</b> 8 บิต/พิกเซล (256 ระดับ 0–255) | <b>Color RGB:</b> 24 บิต/พิกเซล (R=8, G=8, B=8 ได้ 2²⁴ ≈ 16.7 ล้านสี) | <b>Indexed Color:</b> 8 บิต/พิกเซล ชี้ตาราง Palette สูงสุด 256 สี ประหยัดไฟล์ GIF | <b>คำศัพท์ภาพ:</b> Resolution = ค.ละเอียด (ppi/dpi) | Aspect ratio = สัดส่วน กว้าง:ยาว (เช่น 640x480 คือ 4:3) | Pixel = Picture + Element ในเมตริกซ์ f(x, y) | <b>สูตรคำนวณขนาดไฟล์ภาพ (File Size):</b> [formula]Bits = W × H × Bit Depth  |  Bytes = Bits/8  |  MB = Bytes/10⁶ (ฐาน 10 ตามสไลด์ อ.ดร.พยุงศักดิ์)[/formula] | <b>ตัวอย่างคำนวณในสไลด์ (ภาพขนาด 512x512):</b> ขาวดำ 1-bit: 512 × 512 × 1 = 262,144 Bits = 32,768 Bytes ≈ 0.033 MB | Grayscale 8-bit: 512 × 512 × 8 = 2,097,152 Bits = 262,144 Bytes ≈ 0.262 MB | Color RGB 24-bit: 512 × 512 × 8 × 3 = 6,291,456 Bits = 786,432 Bytes ≈ 0.786 MB | <b>ฮีสโทแกรม & Point Operation:</b> Histogram กราฟแจกแจงพิกเซลตามระดับเทา (มืด=กองซ้าย, สว่าง=กองขวา, คอนทราสต์ต่ำ=กระจุกกลาง, คอนทราสต์ดี=กระจายทั่ว) | <b>Brightness:</b> [formula]B = (1/MN) Σ f(x,y) (ค่าเฉลี่ย)[/formula] | <b>Contrast:</b> [formula]C = √( (1/MN) Σ (f(x,y) - B)² ) (SD)[/formula] | <b>สมการปรับภาพ:</b> [formula]g(x, y) = a · f(x, y) + b[/formula] | <b>ตัวอย่างในสไลด์:</b> a = 2 เพิ่ม Contrast กราฟชันขึ้น ภาพสว่างขึ้น | a = 0.5 ลด Contrast กราฟชันน้อยลง ภาพมืดลง | b = 101 เพิ่ม Brightness ยกกราฟเริ่มที่จุด 101 | Clipping: ถ้า < 0 → 0, ถ้า > 255 → 255 | Negative: [formula]g(x, y) = 255 - f(x, y)[/formula] | <b>เทคนิคแต่งภาพ:</b> Anti-aliasing (เกลี่ยขอบหยัก), Transformation (ย่อ ขยาย หมุน บิด), Dithering (ลวงตาเลียนสีที่ไม่มีในตาราง), Rendering (ปูพื้นผิวแสงเงา 3D), Halftoning (จุดขนาดต่างๆ แทน ค.เข้ม) | <b>จอภาพ & กล้องถ่ายภาพ:</b> Interlaced Scan (60 fields/s รวมเป็น 30 frames/s เพื่อประหยัดแบนด์วิดท์) | Double Buffering (2 บัฟเฟอร์ สลับตอน Vertical Blanking ซ่อนรอยวาด) | <b>วิวัฒนาการกล้องในสไลด์:</b> Camera Obscura → George Eastman (1888 ฟิล์มม้วน Kodak Brownie 1910) → Leica I (1925 35mm) → Argus C3 (1939 ทรงอิฐ) → Asahiflex IIb (1954 SLR) → Polaroid J66 (1961 Instant) | <b>ภาพเคลื่อนไหว (แอนิเมชัน จุดออกสอบเปรียบเทียบ):</b> <mark style="background-color: #fbcfe8;">Traditional Animation (วาดมือ): สวยงาม มีศิลปะ ใช้คนเยอะ เวลามาก ต้นทุนแพงที่สุด!</mark> | Stop Motion: ขยับหุ่น/ดินน้ำมัน ทีละเฟรม ทุ่มเทเวลาสูง | <mark style="background-color: #bbf7d0;">Computer Animation: ซอฟต์แวร์ 2D/3D (Maya, 3DS Max) สะดวก รวดเร็ว ต้นทุนถูกสุด & ประหยัดเวลาที่สุด!</mark> | <b>Frame rates:</b> ภาพยนตร์ 24 fps, PAL 25 fps, NTSC 29.97/30 fps`
      },
      {
        id: 'card-ch14',
        title: 'บทที่ 14: โครงข่ายประสาทเทียม (ANN) & Deep Learning',
        tag: 'Neural Network',
        colorTheme: 'pink',
        content: `<b>หลักการ ANN:</b> โมเดล Connectionist ขนาน เลียนแบบโครงข่ายประสาทสมองมนุษย์ | <b>จับคู่ประสาทชีววิทยา vs ANN:</b> Dendrite (เดนไดรท์) ↔ Input (xᵢ) นำสัญญาณเข้า | Synapse (ไซแนปส์) ↔ Weight (wᵢ) ค่าน้ำหนัก ค.สัมพันธ์ | Cell Body (นิวเคลียส) ↔ Summation (Σ) & Activation Function | Axon (แอคซอน) ↔ Output (y) ส่งสัญญาณออก | <b>สมการนิวรอน:</b> [formula]y = f( Σ wᵢ xᵢ + b )[/formula] ถ้าผลรวม > Threshold จึงส่ง Output | <b>ตัวอย่างสไลด์แยกแยะรูปทรงบนกริด 3x3 (9 ช่อง):</b> สี่เหลี่ยมขอบอยู่ช่อง 1,2,3,4,6,7,8,9 ให้กำหนด Weight ช่องเหล่านี้สูง ถ้ามีเส้นขีดผ่านคูณ Weight แล้วรวมเทียบ Threshold แยกสี่เหลี่ยมกับสามเหลี่ยมได้ | <b>4 รูปแบบ ก.เรียนรู้ (Learning Types):</b> 1) <b>Supervised:</b> มีผู้สอน มีเฉลย (Target) วัด Error แล้วปรับ Weight (เหมือนครูสอน นร.) | 2) <b>Unsupervised:</b> ไม่มีผู้สอน จัดกลุ่มเอง ตาม ค.คล้าย (Clustering เช่น แยกพันธุ์พืชพันธุ์สัตว์) | 3) <b>Semi-supervised:</b> ใช้ข้อมูลมี Label เล็กน้อย + ไม่มี Label จำนวนมากเพื่อประหยัดต้นทุน | 4) <b>Reinforcement Learning:</b> ลองผิดลองถูก มี Reward (รางวัล) และ Penalty (ลงโทษ) | <b>Activation Functions ที่สั่งค้นเพิ่ม:</b> Threshold / Binary Step ([formula]f(x) = 1 ถ้า x ≥ T, 0 ถ้า x < T[/formula]) | Sigmoid Function (S-curve: [formula]f(x) = 1 / (1 + e⁻ᵃˣ)[/formula] เรียบต่อเนื่อง 0 ถึง 1) | <mark style="background-color: #bbf7d0;">ReLU: [formula]f(x) = max(0, x)[/formula] นิยมสุดใน Deep Learning ลด Vanishing Gradient</mark> | Softmax: ปรับหลาย Output เป็น ค.น่าจะเป็น รวมได้ 1 | <b>คำสำคัญ:</b> <mark style="background-color: #fef08a;">Backpropagation (อัลกอริทึมปรับ Weight ย้อนกลับจาก Output สู่ Input ลด Error)</mark> | Epoch (จำนวนรอบที่นำข้อมูลฝึกทั้งชุดมาเรียนรู้จนครบ 1 รอบสมบูรณ์) | CNN (Convolutional Neural Net เหมาะกับภาพใบหน้า OCR) | Data Mining (ค้นหารูปแบบที่ซ่อนในฐานข้อมูลขนาดใหญ่) | <b>งานวิจัยในสไลด์:</b> ควบคุมแอร์ ประหยัดไฟตึก SCB Phase 1 รัชโยธิน | ซอฟต์แวร์ Synface (อ่านปากช่วยคนหูหนวก แม่น 84% RNID อังกฤษ) | BEAM Robot (หุ่นยนต์แมลงวงจรทรานซิสเตอร์ Mark Tilden ขาสะดุดปรับวงจรก้าวทิศอื่นทันที) | รู้จำตัวเลข 0–9 (16x16 พิกเซล 33 แพตเทิร์น) | รู้จำลายเซ็นต์ (48x16, 100x32, 300x100 รวม 150 แพตเทิร์น)`
      },
      {
        id: 'card-ch15',
        title: 'บทที่ 15: ระบบผู้เชี่ยวชาญ (Expert System)',
        tag: 'Expert System',
        colorTheme: 'mint',
        content: `<b>นิยาม:</b> โปรแกรมจำลอง ก.ตัดสินใจ และ ค.รู้ของผู้เชี่ยวชาญมนุษย์ เฉพาะด้านด้วย ก.ใช้เหตุผลเชิงอนุมาน (Inference) | <b>5 ส่วนประกอบหลักของ ES:</b> 1) <b>Knowledge Base:</b> เก็บตรรกะ/กฎ IF... THEN... | 2) <b>Inference Engine:</b> นำกฎมาประมวลผลกับข้อเท็จจริง หาข้อสรุป | 3) <b>Knowledge Acquisition:</b> ดึงและถอด ค.รู้จากผู้เชี่ยวชาญ/ตำราลงฐาน ค.รู้ | 4) <b>Explanation Subsystem:</b> อธิบายที่มาของคำตอบและเหตุผล | 5) <b>User Interface:</b> ติดต่อสื่อสารกับผู้ใช้เสมือนคุยกับคนจริง | <b>วิธีการอนุมาน (Chaining):</b> <mark style="background-color: #bae6fd;">Forward Chaining (Data-driven เริ่มจากข้อเท็จจริง → ไล่กฎไปข้างหน้า หาข้อสรุป)</mark> | <mark style="background-color: #fed7aa;">Backward Chaining (Goal-driven เริ่มจากเป้าหมาย → ย้อนตรวจข้อเท็จจริง)</mark> | <b>ตัวอย่างสไลด์ Animal ES:</b> เลือดอุ่น? Yes | มีขน? Yes | เดิน? Yes | ไม่ว่ายน้ำ? Yes | กินเนื้อ? Yes | ขนาดใหญ่? Yes | กินคน? Yes | เป็นนักล่า? Yes | ลายพาดกลอน? Yes → <mark style="background-color: #fef08a;">สรุปผลคือ "Tiger (เสือ)"</mark> | <b>5 ขั้นตอนพัฒนา:</b> วิเคราะห์ปัญหา → เลือกอุปกรณ์ → ถอด ค.รู้ → สร้างต้นแบบ → ขยาย ก.ทดสอบ และบำรุงรักษา | <b>ระบบอัจฉริยะที่สั่งค้นเพิ่ม:</b> <b>Rule-Based System:</b> ตัดสินใจตามกฎ IF-THEN | <b>Case-Based Reasoning (CBR):</b> เทียบเคียงกรณีในอดีต | <b>Fuzzy Expert System:</b> ตรรกะคลุมเครือ มีระดับ ค.เป็นสมาชิก 0 ถึง 1 | <b>Deterministic System:</b> ระบบแน่นอน ผลลัพธ์คาดเดาได้ 100% ไร้ ก.สุ่ม | <b>Probabilistic System:</b> อิง ค.น่าจะเป็น มี ค.ไม่แน่นอน | <b>Static System:</b> ระบบคงที่ สถานะไม่เปลี่ยนแปลงตามเวลา | <b>Data Collection vs Knowledge Acquisition:</b> Data Collection = เก็บข้อมูลดิบทั่วไป | Knowledge Acquisition = สกัดและจัดระเบียบองค์ความรู้เชิงลึกจากผู้เชี่ยวชาญใส่ใน Knowledge Base`
      },
      {
        id: 'card-exam-esp',
        title: '📌 ข้อมูลสำคัญวันสอบ & ส่งโปรเจกต์ ESP',
        tag: 'เงื่อนไขสอบ',
        colorTheme: 'lilac',
        content: `<mark style="background-color: #fef08a;"><b>เงื่อนไขห้องสอบ:</b> ข้อสอบปรนัย 60 ข้อ | จดเข้าห้องสอบได้ 1 แผ่น A4 (หน้า-หลัง) เท่านั้น | สอบวันที่ 19 (ห้องสอบเดิม)</mark> | <mark style="background-color: #fbcfe8;"><b>ก.ส่งโปรเจกต์วันสอบ:</b> ต้องนำโปรเจกต์บอร์ด ESP (ESP8266/ESP32) มาส่งและสาธิต ตัวบอร์ดต้องตั้งค่าเป็น WiFi Access Point (Hotspot) ปล่อยสัญญาณในตัว มี Web Server ในตัว ให้เครื่องอื่น/มือถืออื่นเชื่อมเข้ามาคุยกับบอร์ดได้โดยไม่ต้องต่อเน็ตภายนอก</mark>`
      }
    ]
  }
];

export const COLOR_THEMES = [
  { id: 'lime', name: 'Lime Pastel', bg: '#f4fae8', border: '#cce69b', accent: '#4d7c0f', chip: '#dceeb1' },
  { id: 'lilac', name: 'Lilac Pastel', bg: '#f6f2fd', border: '#d4c2f8', accent: '#4338ca', chip: '#c5b0f4' },
  { id: 'mint', name: 'Mint Pastel', bg: '#eef8f1', border: '#b2e2bc', accent: '#047857', chip: '#c8e6cd' },
  { id: 'coral', name: 'Coral Pastel', bg: '#fdf3ed', border: '#f7c2aa', accent: '#c2410c', chip: '#f3c9b6' },
  { id: 'cream', name: 'Cream Warm', bg: '#fbf8ee', border: '#ebdcb9', accent: '#b45309', chip: '#f4ecd6' },
  { id: 'pink', name: 'Pink Rose', bg: '#fcf2f2', border: '#f1bebe', accent: '#be123c', chip: '#efd4d4' },
  { id: 'mono', name: 'Monochrome Clean', bg: '#ffffff', border: '#e5e7eb', accent: '#111827', chip: '#f3f4f6' }
];

export const FONT_SIZES = [
  {
    id: 'cheatsheet-pro',
    name: '⚡ ชีทสอบ A4 จิ๋วพิเศษ (7.2px) - เหมือน PDF',
    class: 'text-[7.2px]',
    cardPadding: 'p-0.5',
    gap: 'gap-1'
  },
  {
    id: 'ultra-dense',
    name: 'จิ๋วมาก (8.2px)',
    class: 'text-[8.2px]',
    cardPadding: 'p-1',
    gap: 'gap-1'
  },
  {
    id: 'normal',
    name: 'ปกติ (9.2px) - แนะนำ',
    class: 'text-[9.2px]',
    cardPadding: 'p-1.5',
    gap: 'gap-1.5'
  },
  {
    id: 'comfortable',
    name: 'สบายตา (10.2px)',
    class: 'text-[10.2px]',
    cardPadding: 'p-2',
    gap: 'gap-2'
  }
];

export const LINE_HEIGHTS = [
  {
    id: 'dense',
    name: 'ระยะบรรทัด: แน่น (1.35)',
    value: '1.35',
    lineGap: '2px',
    desc: 'อัดเนื้อหาแน่น ไม่ทับกัน'
  },
  {
    id: 'compact',
    name: 'ระยะบรรทัด: กระชับ (1.45)',
    value: '1.45',
    lineGap: '2.5px',
    desc: 'กระชับพอดีสำหรับชีท A4'
  },
  {
    id: 'normal',
    name: 'ระยะบรรทัด: ปกติ (1.55) - แนะนำ',
    value: '1.55',
    lineGap: '3.5px',
    desc: 'มาตรฐาน สวยงาม วรรณยุกต์โปร่ง'
  },
  {
    id: 'relaxed',
    name: 'ระยะบรรทัด: โปร่งสบาย (1.70)',
    value: '1.70',
    lineGap: '5px',
    desc: 'โปร่งสบาย อ่านง่ายสุด'
  }
];

