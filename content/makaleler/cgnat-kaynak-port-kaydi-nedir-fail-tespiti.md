---
title: "CGNAT ve Kaynak Port Kaydı Nedir? Ceza Soruşturmasında Fail Tespiti"
slug: "cgnat-kaynak-port-kaydi-nedir-fail-tespiti"
date: "2026-09-08T21:19:00+03:00"
updated: "2026-09-08T22:37:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "CGNAT Kaynak Port"
summary: "CGNAT kullanılan bağlantılarda aynı genel IP adresi aynı anda birden çok abone tarafından paylaşılabilir. Bu nedenle fail tespitinde IP adresi kadar kaynak port, tarih-saat ve servis sağlayıcı kayıtlarının doğru eşleştirilmesi önemlidir."
seo_title: "CGNAT ve Kaynak Port Kaydı Nedir? Fail Tespiti"
description: "CGNAT ve kaynak port kaydı nedir? Aynı IP birden çok kullanıcıda olabilir mi? Port, saniye hassasiyetli zaman bilgisi ve servis sağlayıcı logları nasıl okunur?"
series_id: "ncmec-dijital-delil"
series_order: 6
sources:
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
---

## Kısa cevap: CGNAT ve kaynak port neden önemlidir?

**CGNAT kullanılan bir internet bağlantısında aynı genel IP adresi aynı anda çok sayıda abone tarafından paylaşılabilir.** Bu durumda yalnız IP adresi ve tarih-saat bilgisi belirli aboneyi ayırmak için yeterli olmayabilir. Kaynak port bilgisi de gerekli hâle gelebilir.

Bir önceki bölümde [IP adresinin tek başına neden her zaman faili göstermediğini](/makaleler/ip-adresi-tek-basina-sucun-failini-gosterir-mi/) ele aldık. CGNAT bu problemin teknik olarak en önemli örneklerinden biridir.

Soruşturma dosyasında;

**genel IP + kaynak port + doğru tarih-saat + servis sağlayıcı kaydı**

birlikte bulunduğunda belirli bağlantının hangi abonelik tarafından kullanıldığı daha sağlıklı biçimde tespit edilebilir.

## NAT ve CGNAT arasındaki fark

NAT, “Network Address Translation” ifadesinin kısaltmasıdır. Bir ağdaki birden fazla cihazın internete çıkarken ortak bir genel IP adresini kullanabilmesini sağlar. Evdeki modem bunun en tanıdık örneğidir: telefon, tablet ve bilgisayar ev ağı içinde farklı yerel IP adreslerine sahip olabilir; dış dünyaya ise çoğu zaman tek genel IP üzerinden çıkar.

CGNAT, bu mantığı internet servis sağlayıcısı düzeyine taşır. Servis sağlayıcı çok sayıda aboneyi sınırlı sayıdaki genel IP adresleri üzerinden internete çıkarabilir. Böylece farklı aboneler aynı anda aynı genel IP adresini kullanabilir.

Bu nedenle “şu IP adresi şu kişiye aittir” şeklindeki ifade, CGNAT kullanılan bir altyapıda çoğu zaman yeterince açıklayıcı değildir.

## Kaynak portun ayırıcı işlevi

İnternet bağlantılarında IP adresinin yanında port numaraları da kullanılır. CGNAT sisteminde farklı abonelerin aynı genel IP üzerinden kurduğu bağlantılar port bilgileri ve zaman kayıtlarıyla birbirinden ayrılabilir.

Bir platform kaydı genel IP adresini, kaynak portu ve olay zamanını birlikte içeriyorsa, servis sağlayıcının CGNAT logları üzerinden daha isabetli abone eşleştirmesi yapılabilir.

Kaynak port bulunmadığında ise aynı IP'nin aynı anda birden fazla abone tarafından kullanıldığı bir altyapıda belirli aboneliğe ulaşmak güçleşebilir.

## Aynı genel IP aynı anda çok sayıda kişiyi gösterebilir

CGNAT'ın en önemli sonucu budur: aynı genel IP adresi tek kişi veya tek abonelik anlamına gelmeyebilir.

Örneğin bir platform saat 21.14.32'de `X` genel IP adresinden belirli hesabın işlem yaptığını kaydetmiş olsun. CGNAT kullanılıyorsa aynı saniyede bir abone 41000, başka bir abone 47000, üçüncü bir abone 53000 numaralı port üzerinden aynı genel IP'yi kullanmış olabilir.

Platform yalnız genel IP'yi tutmuşsa, servis sağlayıcı hangi abonenin ilgili bağlantıyı kurduğunu her zaman kesin biçimde ayıramayabilir. Bu nedenle **kaynak port verisinin bulunup bulunmadığı**, özellikle fail bağlantısının IP kaydına dayandığı dosyalarda doğrudan önem taşır.

## Kaynak port eksikliği her dosyada aynı sonucu doğurmaz

Kaynak port bilgisinin bulunmaması dosyanın otomatik olarak çökeceği anlamına gelmez. Eksikliğin ağırlığı, dosyadaki diğer delillere göre değerlendirilir.

Olayla ilişkili hesabın şüphelinin telefonunda açık olması, aynı hesaba başka zamanlarda şüpheliye özgü bağlantılardan giriş yapılması, bildirime konu dosyanın cihazda bulunması, hesapla eşleşen e-posta veya telefon numarası ya da cihazdaki uygulama ve tarayıcı kayıtları başka bir delil zinciri kurabilir.

Buna karşılık fail bağlantısı yalnız CGNAT ortamındaki bir genel IP tespitine dayanıyorsa, kaynak port eksikliği çok daha belirleyici hâle gelir.

## Tarih ve saat bilgisi neden saniye düzeyinde önem kazanabilir?

Kaynak port tek başına yeterli değildir. Port tahsisleri ve bağlantılar zaman içinde değişebilir. Dinamik IP ve özellikle CGNAT sistemlerinde aynı genel IP ve hatta aynı port farklı zamanlarda farklı bağlantılarla ilişkilendirilebilir.

Bu nedenle sağlıklı bir eşleştirme için genellikle şu dört unsur birlikte okunmalıdır:

1. **Genel IP adresi**
2. **Kaynak port**
3. **Tarih ve saat**
4. **Servis sağlayıcının aynı zaman dilimine ait CGNAT kayıtları**

Saniye düzeyindeki farklar bazı dosyalarda önem taşıyabilir. Platform kaydının UTC saatinde, servis sağlayıcı kaydının Türkiye yerel saatinde tutulması gibi durumlarda hatalı dönüşüm yanlış abone eşleştirmesine yol açabilir.

Bu nedenle “IP ve port tuttu” sonucu, ancak iki kaydın aynı zaman standardında ve yeterli hassasiyetle karşılaştırıldığı gösterilebildiğinde anlamlıdır.

## Platform kaydı ile servis sağlayıcı cevabı birlikte okunmalıdır

CGNAT tespitinin güvenilirliği tek bir kurumun çıktısına bakılarak değerlendirilmemelidir. Platformun ürettiği IP, port ve zaman kaydı ile servis sağlayıcının aynı ana ilişkin tahsis kaydı birbirini karşılamalıdır.

Kaynak port platform verisinde bulunduğu hâlde servis sağlayıcı sorgusunda kullanılmamışsa, zaman dilimi dönüşümü belirsizse, aynı IP aynı zaman aralığında farklı abonelerle ilişkilendirilebiliyorsa veya kayıtlar birbiriyle çelişiyorsa abone eşleştirmesinin hangi ham verilere dayanılarak yapıldığı açıklanmalıdır.

Bu tür tutarsızlıklar otomatik hukuki sonuç yaratmaz. Ancak **fail tespitinin teknik güvenilirliğini doğrudan etkileyen inceleme konuları**dır ve gerektiğinde bilirkişi değerlendirmesini gerektirebilir.

## NCMEC raporlarında CGNAT sorunu

NCMEC/CyberTipline raporlarının içeriği dosyadan dosyaya değişir. Platform tarafından gönderilen teknik veriler arasında IP adresi bulunabilir; bazı raporlarda bağlantıya ilişkin daha ayrıntılı bilgiler de yer alabilir.

Türkiye'de bu veriler üzerinden abone tespiti yapılırken kullanılan internet altyapısı önem taşır. NCMEC raporunda yalnız genel IP ve zaman bilgisi varsa, servis sağlayıcının bu IP'yi olay anında tek bir aboneye mi yoksa CGNAT üzerinden çok sayıda aboneye mi kullandırdığı araştırılmalıdır.

Bu nedenle [NCMEC raporunun delil değerini](/makaleler/ncmec-raporu-tek-basina-mahkumiyet-yeterli-mi/) incelerken yalnız raporun içeriğine değil, rapordan Türkiye'deki kişiye ulaşılırken kullanılan teknik eşleştirme yöntemine de bakılır.

## Doğru CGNAT eşleşmesi failin kimliğini tek başına bitirmez

CGNAT kaydı doğru biçimde eşleştirildiğinde belirli internet bağlantısının hangi abonelik üzerinden kullanıldığını gösterebilir. Fakat o bağlantıyı olay anında hangi kişinin kullandığı ayrı sorudur.

Kullanıcı hesabı, cihaz kayıtları, olayla ilişkili dosyalar, uygulama oturumları, e-posta ve telefon bilgileri ve ortak ağın kullanım biçimi bu nedenle önem taşır.

CGNAT teknik olarak **abone tespitini** güçlendirir; ceza hukukundaki **fail tespitinin tamamını** tek başına bitirmez.

## Servis sağlayıcı cevabında bulunması gereken temel bilgiler

Bir ceza dosyasındaki servis sağlayıcı cevabı değerlendirilirken sorgulanan genel IP adresi, tarih ve saat, varsa kaynak port, zaman dilimi, tespit edilen abonelik ve kaydın hangi teknik log üzerinden üretildiği mümkün olduğunca açık olmalıdır.

Aynı IP'nin CGNAT kapsamında kullanıldığı biliniyorsa ve kaynak port olmadan doğrudan abone tespiti yapılmışsa, bu sonucun teknik dayanağının ayrıca açıklanması gerekebilir.

## CGNAT verisi ile cihaz incelemesinin birleştiği nokta

Dijital soruşturma çoğu zaman abonelik tespitiyle bitmez. İkinci aşamada şüphelinin telefon veya bilgisayarında ilgili hesabın kullanılıp kullanılmadığı, bildirime konu içeriğin bulunup bulunmadığı ve olay zamanına ilişkin teknik izlerin mevcut olup olmadığı araştırılabilir.

İşte burada ceza soruşturması fail tespitinden **dijital delilin elde edilme usulüne** geçer.

Bu nedenle serinin [bir sonraki bölümünde CMK 134 kapsamında bilgisayar ve telefonda arama, kopyalama ve el koyma şartları](/makaleler/cmk-134-bilgisayar-telefon-arama-kopyalama-el-koyma/) ele alınmaktadır.

<div class="cyber-note"><strong>CGNAT dosyasında üç ayrı katman vardır.</strong><br>Genel IP hangi bağlantıyı gösteriyor? Kaynak port ve zaman bilgisi hangi aboneliği ayırıyor? Bu aboneliği olay anında kullanan kişinin kim olduğu hangi başka delillerle ortaya konuluyor?</div>

## Sonuç

CGNAT, aynı genel IP adresinin aynı anda çok sayıda abone tarafından kullanılabilmesine imkân verir. Bu nedenle ceza soruşturmasında yalnız genel IP adresinden hareketle doğrudan kişi tespiti yapmak bazı dosyalarda teknik olarak yetersiz kalabilir.

Sağlıklı bir eşleştirme için **genel IP, kaynak port, doğru tarih-saat ve servis sağlayıcı loglarının** birlikte değerlendirilmesi gerekir. Bu veriler arasında çelişki varsa eşleştirmenin ham teknik dayanağı görülmelidir.

Bunlar doğru eşleşse bile elde edilen sonuç çoğu zaman abonelik tespitidir. Failin kim olduğu; hesap, cihaz ve diğer dijital delillerle ayrıca ortaya konulur.
