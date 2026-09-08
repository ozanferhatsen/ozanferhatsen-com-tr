---
title: "IP Adresi Tek Başına Suçun Failini Gösterir mi?"
slug: "ip-adresi-tek-basina-sucun-failini-gosterir-mi"
date: "2026-09-08T21:18:00+03:00"
updated: "2026-09-08T21:18:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "IP Adresi"
summary: "IP adresi önemli bir teknik izdir; ancak çoğu dosyada doğrudan kişiyi değil, belirli bir zamanda kullanılan internet bağlantısını gösterir. Abone, cihaz ve gerçek kullanıcı arasındaki bağın başka delillerle kurulması gerekir."
seo_title: "IP Adresi Tek Başına Suçun Failini Gösterir mi?"
description: "IP adresi tek başına fail tespiti için yeterli mi? Dinamik IP, ortak internet, CGNAT, kaynak port, hesap ve cihaz incelemesinin ceza dosyasındaki rolü."
series_id: "ncmec-dijital-delil"
series_order: 5
sources:
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
---

## Kısa cevap: IP adresi tek başına fail midir?

**Hayır. IP adresi çoğu dosyada bir kişiyi doğrudan teşhis eden kimlik numarası değildir.** Belirli bir tarih ve saatte hangi internet bağlantısının kullanıldığını göstermeye yarayan önemli bir teknik veridir. Fakat o bağlantıyı kimin kullandığı ayrıca araştırılmalıdır.

Bu ayrım özellikle NCMEC, sosyal medya, çevrimiçi paylaşım, tehdit, hakaret, dolandırıcılık ve benzeri dijital soruşturmalarda önem taşır. Soruşturma makamı bir IP adresinden internet aboneliğine ulaşabilir. Ancak;

**IP adresi → abonelik**

ile

**abonelik → suçu işleyen kişi**

aynı şey değildir.

Bir internet aboneliğinin belirli kişi adına kayıtlı olması, o bağlantı üzerinden gerçekleşen her işlemin mutlaka o kişi tarafından yapıldığını tek başına göstermez.

## IP adresi gerçekte neyi gösterir?

IP adresi, internete bağlı cihazların veya ağların haberleşmesinde kullanılan teknik adresleme bilgisidir. Ceza soruşturmalarında ise çoğu zaman bir çevrimiçi işlemin hangi bağlantı üzerinden gerçekleştiğini belirlemek için kullanılır.

Örneğin bir platform;

- belirli kullanıcı hesabının giriş yaptığı IP adresini,
- işlemin gerçekleştiği tarih ve saati,
- bazen kaynak port veya başka bağlantı bilgilerini

saklamış olabilir.

Bu kayıt internet servis sağlayıcısının abonelik kayıtlarıyla karşılaştırıldığında, ilgili zaman diliminde IP adresinin hangi aboneliğe tahsis edildiği belirlenebilir.

Buraya kadar ulaşılan sonuç çoğu zaman şudur:

> “İşleme ilişkin internet bağlantısı bu abonelikle ilişkilidir.”

Bu sonuç değerlidir. Fakat henüz “işlemi bu kişi yaptı” sonucuyla aynı değildir.

## İnternet abonesi ile gerçek kullanıcı neden farklı olabilir?

Ev interneti, işyeri ağı veya ortak Wi-Fi bağlantısı tek kişi tarafından kullanılmayabilir.

Aynı bağlantıya;

- eş ve aile bireyleri,
- çalışanlar,
- misafirler,
- ortak kullanılan cihazlar,
- kablosuz ağa erişebilen başka kişiler

bağlanabilir.

Ayrıca abonelik bir kişi adına kayıtlı olsa da, bilgisayar veya telefon başka biri tarafından kullanılabilir. Bu nedenle fail tespiti yapılırken yalnız abonelik kaydına bakılması bazı dosyalarda eksik kalır.

Buna karşılık “interneti başkaları da kullanıyordu” biçimindeki soyut bir açıklama da kendiliğinden yeterli değildir. Bu ihtimalin olayın teknik verileriyle uyuşup uyuşmadığı araştırılır.

Asıl soru şudur: **IP adresinden ulaşılan bağlantı ile şüpheli kişinin hesabı, cihazı ve olay zamanındaki kullanımı arasında nasıl bir bağ kurulmuştur?**

## Dinamik IP adresi neyi değiştirir?

Bir IP adresi sürekli aynı aboneye tahsis edilmeyebilir. İnternet servis sağlayıcısı aynı IP adresini farklı zamanlarda farklı abonelere verebilir.

Bu nedenle yalnız IP numarası çoğu zaman yeterli değildir. **Tarih ve saat bilgisi zorunlu derecede önemlidir.**

Örneğin aynı IP adresi;

- saat 10.00'da A abonesinde,
- saat 14.00'te B abonesinde

olabilir.

Bu durumda platform kaydındaki zaman ile servis sağlayıcının tahsis kayıtlarının doğru biçimde eşleştirilmesi gerekir.

Saniye düzeyindeki zaman bilgisi, kayıtların kullandığı saat dilimi ve yaz-kış saati uygulaması gibi ayrıntılar da bazı dosyalarda belirleyici hâle gelebilir.

Dolayısıyla bir bilirkişi veya kolluk tespitinde yalnız “IP adresi şüpheli adına kayıtlıdır” denmesi yerine **hangi tarih ve saate göre eşleştirme yapıldığı** görülebilmelidir.

## Aynı IP adresi aynı anda birden fazla kişide olabilir mi?

Evet. Özellikle CGNAT kullanılan bağlantılarda aynı genel IP adresi aynı anda çok sayıda abone tarafından paylaşılabilir.

Bu durumda yalnız IP adresi ve tarih-saat bilgisi, belirli aboneyi ayırmaya yetmeyebilir. **Kaynak port bilgisinin** de bulunması gerekebilir.

Bu mesele bu dosyanın [bir sonraki bölümünde CGNAT ve kaynak port kayıtları bakımından ayrıntılı olarak ele alınmaktadır](/makaleler/cgnat-kaynak-port-kaydi-nedir-fail-tespiti/).

Burada önemli olan şudur: teknik altyapı değiştikçe “IP adresi bulundu, kişi bulundu” biçimindeki düz denklem daha da sorunlu hâle gelebilir.

## NCMEC dosyalarında IP adresi neden önemlidir?

NCMEC/CyberTipline raporlarında kullanıcı hesabına ve bağlantıya ilişkin teknik bilgiler bulunabilir. Bunlardan biri IP adresidir.

Önceki bölümlerde ele alındığı üzere NCMEC raporu soruşturmanın başlangıç noktası olabilir. Rapor içindeki IP verisi Türkiye'deki internet aboneliğine ulaşılmasını sağlayabilir.

Fakat bundan sonra ikinci bir soru başlar:

**Bu internet bağlantısını olay anında kim kullandı?**

Bu nedenle [NCMEC raporunun tek başına mahkûmiyet için yeterli olup olmadığı](/makaleler/ncmec-raporu-tek-basina-mahkumiyet-yeterli-mi/) tartışılırken IP adresinin de diğer dijital delillerle birlikte değerlendirilmesi gerekir.

Örneğin;

- rapordaki hesap bilgisi,
- e-posta veya telefon numarası,
- hesaba giriş yapılan başka IP adresleri,
- şüpheliye ait cihazdaki uygulama kayıtları,
- aynı içeriğin cihazda bulunması,
- dosya hash eşleşmeleri,
- kullanıcı oturumları

birbirini destekliyorsa fail bağlantısı güçlenebilir.

Buna karşılık yalnız bir IP-abone eşleşmesi varsa, cihaz ve kullanıcı bağlantısının ayrıca araştırılması gerekebilir.

## IP adresinden sonra hangi deliller araştırılır?

Her dosyanın yapısı farklıdır. Bununla birlikte failin belirlenmesi için IP kaydının yanında şu tür veriler önem taşıyabilir:

- kullanıcı hesabına ait e-posta ve telefon bilgileri,
- hesabın oluşturulma ve giriş kayıtları,
- olay zamanındaki diğer IP bağlantıları,
- cihazlarda bulunan hesap oturumları,
- tarayıcı veya uygulama verileri,
- olayla ilişkili dosyaların cihazda bulunup bulunmadığı,
- ortak kullanılan cihaz veya ağın yapısı,
- telefon numarası, SIM ve cihaz ilişkisinin dosyayla bağlantısı,
- dosyanın oluşturulma, indirilme veya paylaşılma zamanları.

Murat Volkan Dülger'in aktardığı Yargıtay uygulamasında da yalnız IP tespitiyle yetinilmeyip fail bağlantısını doğrulayabilecek ek teknik araştırmaların yapılmasına önem verildiği görülmektedir.

Buradaki temel fikir basittir: **IP adresi soruşturmayı bir bağlantıya götürür; ceza sorumluluğu ise o bağlantı ile kişi arasında güvenilir bir bağ kurulmasını gerektirir.**

## IP adresi tespitinde tarih ve saat hatası neye yol açabilir?

Dijital soruşturmalarda zaman verisi yalnız yardımcı bilgi değildir. Yanlış saat eşleştirmesi yanlış abonenin tespit edilmesine kadar gidebilir.

Özellikle şu hususlar kontrol edilmelidir:

- platform kaydının UTC mi yerel saat mi kullandığı,
- servis sağlayıcının kayıt formatı,
- saniye veya milisaniye bilgisinin bulunup bulunmadığı,
- CGNAT kullanılıyorsa kaynak port bilgisinin mevcut olup olmadığı,
- aynı IP'nin farklı abonelere hangi zaman aralıklarında tahsis edildiği.

Bu nedenle teknik raporun yalnız sonucu değil, **sonuca nasıl ulaşıldığını gösteren veri zinciri** de önemlidir.

## Modem kimin evindeyse fail de o kişi midir?

Hayır. Modemin bulunduğu adres, internet aboneliğinin kime ait olduğu ve suçu gerçekleştiren kullanıcının kim olduğu ayrı kavramlardır.

Ancak olayın koşullarına göre bu veriler birbirini destekleyebilir.

Örneğin tek kişinin yaşadığı bir konutta yalnız o kişiye ait cihazdan ilgili hesaba erişim sağlanması ile çok sayıda kişinin kullandığı işyeri ağı aynı ispat problemi değildir.

Bu nedenle mahkeme veya soruşturma makamının somut olayın kullanım yapısını incelemesi gerekir.

## “Wi-Fi şifremi başkası kullanmış olabilir” savunması yeterli midir?

Tek başına hayır.

Bu ihtimal teknik olarak mümkün olabilir. Ancak hukuki değerlendirmede yalnız ihtimalin varlığı değil, **dosyadaki diğer delillerle makul biçimde desteklenip desteklenmediği** önemlidir.

Kablosuz ağın güvenlik ayarları, bağlantı geçmişi, cihaz kayıtları, olay zamanında evde veya işyerinde bulunan kişiler ve ilgili hesabın hangi cihazlarda açık olduğu bu iddianın değerlendirilmesinde önem kazanabilir.

Aynı şekilde savcılık bakımından da yalnız “abonelik onun adına” demek her dosyada yeterli olmayabilir.

## Bir IP tespitinde dosyada hangi belgeler kontrol edilmelidir?

IP adresine dayalı bir ceza dosyasında en azından şu zincirin açık olması beklenir:

1. **Kaynak kayıt:** IP adresini hangi platform veya sistem üretmiştir?
2. **Zaman:** İşlem hangi tarih, saat ve saat diliminde gerçekleşmiştir?
3. **Teknik ayrım:** Dinamik IP veya CGNAT söz konusu mudur?
4. **Servis sağlayıcı cevabı:** İlgili zaman ve gerekiyorsa port bilgisine göre hangi abonelik tespit edilmiştir?
5. **Kullanıcı bağlantısı:** Abonelik ile şüpheli arasında nasıl bağ kurulmuştur?
6. **Hesap bağlantısı:** İşleme konu hesap şüpheliyle nasıl ilişkilendirilmiştir?
7. **Cihaz bağlantısı:** Şüphelinin telefon veya bilgisayarında olayı doğrulayan teknik iz bulunmuş mudur?

Bu halkalardan biri eksik olduğunda bunun sonucu her dosyada otomatik olarak aynı olmaz. Ancak ispat zincirinin gücü buna göre değerlendirilir.

<div class="cyber-note"><strong>IP adresi bir başlangıç noktasıdır, sonuç değil.</strong><br>Ceza dosyasındaki esas mesele IP'nin hangi bağlantıya ait olduğunu bulmak kadar, o bağlantıyı olay anında kullanan kişinin teknik ve diğer delillerle ortaya konulmasıdır.</div>

## Sonuç

IP adresi bilişim suçları soruşturmalarında çok önemli bir teknik izdir. Ancak **IP adresi, internet abonesi ve fail kavramları birbirine eşit değildir.**

Sağlıklı bir değerlendirmede IP kaydı; tarih-saat bilgisi, gerekiyorsa kaynak port, abonelik kaydı, kullanıcı hesabı, cihaz incelemesi ve diğer dijital delillerle birlikte okunur.

Özellikle ortak internet bağlantıları ve CGNAT altyapısında bu ayrım daha da önem kazanır.

Bu nedenle bir ceza dosyasında “IP adresi size ait çıktı” cümlesinden sonra sorulması gereken asıl soru şudur:

**Hangi teknik kayıtlar, hangi zaman bilgisi ve hangi ek deliller bu internet bağlantısını somut fiille ve belirli kişiyle ilişkilendiriyor?**
