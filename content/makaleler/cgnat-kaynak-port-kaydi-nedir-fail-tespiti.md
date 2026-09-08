---
title: "CGNAT ve Kaynak Port Kaydı Nedir? Ceza Soruşturmasında Fail Tespiti"
slug: "cgnat-kaynak-port-kaydi-nedir-fail-tespiti"
date: "2026-09-08T21:19:00+03:00"
updated: "2026-09-08T21:19:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "CGNAT Kaynak Port"
summary: "CGNAT kullanılan bağlantılarda aynı genel IP adresi aynı anda birden çok abone tarafından paylaşılabilir. Bu nedenle fail tespitinde IP adresi kadar kaynak port, tarih-saat ve servis sağlayıcı kayıtlarının doğru eşleştirilmesi önemlidir."
seo_title: "CGNAT ve Kaynak Port Kaydı Nedir? Fail Tespiti"
description: "CGNAT ve kaynak port kaydı nedir? Aynı IP adresi birden çok kullanıcıda olabilir mi? Ceza soruşturmasında IP, port ve zaman bilgisiyle fail tespiti."
series_id: "ncmec-dijital-delil"
series_order: 6
sources:
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
---

## Kısa cevap: CGNAT ve kaynak port neden önemlidir?

**CGNAT kullanılan bir internet bağlantısında aynı genel IP adresi aynı anda çok sayıda abone tarafından paylaşılabilir.** Bu durumda yalnız IP adresi ve tarih-saat bilgisi, belirli aboneyi ayırmak için yeterli olmayabilir. Kaynak port bilgisi de gerekli hâle gelebilir.

Bir önceki bölümde [IP adresinin tek başına neden her zaman faili göstermediğini](/makaleler/ip-adresi-tek-basina-sucun-failini-gosterir-mi/) ele aldık. CGNAT bu problemin teknik olarak en önemli örneklerinden biridir.

Soruşturma dosyasında;

**genel IP + kaynak port + doğru tarih-saat + servis sağlayıcı kaydı**

birlikte bulunduğunda belirli bağlantının hangi abonelik tarafından kullanıldığı daha sağlıklı biçimde tespit edilebilir.

## NAT nedir?

NAT, “Network Address Translation” ifadesinin kısaltmasıdır. Basit anlatımla, bir ağdaki birden fazla cihazın internete çıkarken ortak bir genel IP adresini kullanabilmesini sağlar.

Evdeki modem bunun en tanıdık örneğidir. Telefon, televizyon, tablet ve bilgisayar ev ağı içinde farklı yerel IP adreslerine sahip olabilir; fakat dış dünyaya çoğu zaman modemin kullandığı tek genel IP üzerinden çıkar.

Bu nedenle internet üzerindeki bir platform, her zaman ev içindeki hangi cihazın işlemi yaptığını yalnız genel IP adresinden göremez.

CGNAT ise bu mantığı internet servis sağlayıcısı düzeyine taşır.

## CGNAT nedir?

CGNAT, “Carrier Grade Network Address Translation” olarak adlandırılan ve servis sağlayıcının çok sayıda aboneyi sınırlı sayıdaki genel IP adresleri üzerinden internete çıkardığı tekniktir.

Bu yapıda;

- A abonesi,
- B abonesi,
- C abonesi

aynı anda aynı genel IP adresini kullanabilir.

Aralarındaki teknik ayrım bağlantılara tahsis edilen **port bilgileri** üzerinden yapılabilir.

Bu nedenle CGNAT ortamında yalnız;

> “Şu IP adresi şu kişiye aittir.”

şeklindeki bir değerlendirme yeterince açıklayıcı olmayabilir.

Asıl soru şudur:

**Belirli tarih ve saatte, bu genel IP adresindeki hangi kaynak port hangi aboneye tahsis edilmişti?**

## Kaynak port nedir?

İnternet bağlantılarında IP adresinin yanında port numaraları da kullanılır. Port bilgisi, aynı IP üzerinden gerçekleşen çok sayıdaki bağlantının birbirinden ayrılmasına yardımcı olur.

CGNAT sisteminde servis sağlayıcı, farklı abonelerin internet bağlantılarını belirli port aralıkları veya bağlantı kayıtlarıyla ayırabilir.

Bu nedenle bir platform kaydı;

- genel IP adresini,
- kaynak portu,
- tarih ve saati

birlikte içeriyorsa, servis sağlayıcının CGNAT logları üzerinden daha isabetli abone eşleştirmesi yapılabilir.

Kaynak port bulunmadığında ise aynı IP'nin aynı anda birden fazla abone tarafından kullanıldığı bir altyapıda belirli kişiye ulaşmak güçleşebilir.

## CGNAT kullanılan bir dosyada yalnız IP adresi neden yetmeyebilir?

Bir örnek üzerinden düşünelim.

Bir platform saat 21.14.32'de `X` genel IP adresinden belirli hesabın işlem yaptığını kaydetmiş olsun.

Eğer bu IP o anda yalnız tek aboneye tahsis edilmişse, tarih-saat bilgisiyle abonelik eşleştirmesi yapılabilir.

Fakat CGNAT kullanılıyorsa aynı saniyede;

- birinci abone 41000 numaralı porttan,
- ikinci abone 47000 numaralı porttan,
- üçüncü abone 53000 numaralı porttan

aynı genel IP üzerinden internete çıkmış olabilir.

Platform yalnız genel IP'yi tutmuşsa, servis sağlayıcı hangi abonenin ilgili bağlantıyı kurduğunu her zaman kesin biçimde ayıramayabilir.

Bu nedenle **kaynak port verisinin bulunup bulunmadığı**, özellikle CGNAT kullanılan ceza dosyalarında doğrudan fail tespitiyle ilgili bir meseledir.

## Kaynak port yoksa dosya otomatik olarak çöker mi?

Hayır. Böyle mekanik bir kural yoktur.

Kaynak port bilgisinin bulunmaması, somut dosyada IP-abone eşleştirmesinin gücünü etkileyebilir. Ancak başka deliller aynı kişiyi açık biçimde gösteriyorsa ceza dosyası yalnız bu eksiklikten ibaret değildir.

Örneğin;

- olayla ilişkili hesap şüphelinin telefonunda açık olabilir,
- aynı hesaba başka zamanlarda şüpheliye özgü bağlantılardan giriş yapılmış olabilir,
- bildirime konu dosya cihazda bulunabilir,
- hesapla eşleşen e-posta veya telefon numarası mevcut olabilir,
- cihazdaki uygulama ve tarayıcı kayıtları işlemi doğrulayabilir.

Buna karşılık dosyanın fail bağlantısı yalnız CGNAT ortamındaki bir genel IP tespitine dayanıyorsa, kaynak port eksikliği çok daha önemli hâle gelebilir.

Yani teknik verinin önemi **dosyadaki diğer delillere göre** değerlendirilir.

## Tarih ve saat bilgisi neden port kadar önemlidir?

Kaynak port tek başına da yeterli değildir. Port tahsisleri zaman içinde değişebilir.

Bu nedenle sağlıklı bir CGNAT eşleştirmesi için genellikle şu dört unsurun birlikte okunması gerekir:

1. **Genel IP adresi**
2. **Kaynak port**
3. **Tarih ve saat**
4. **Servis sağlayıcının aynı zaman dilimine ait CGNAT kayıtları**

Burada saniye düzeyindeki farklar bile önem taşıyabilir.

Ayrıca platform kaydının UTC saat diliminde, servis sağlayıcının ise Türkiye yerel saatinde kayıt tutması gibi durumlarda hatalı dönüşüm yanlış eşleştirmeye yol açabilir.

Bu yüzden “IP ve port tuttu” denmesinden önce **iki kaydın aynı zaman standardına çevrilip çevrilmediği** kontrol edilmelidir.

## NCMEC raporlarında CGNAT sorunu nasıl ortaya çıkar?

NCMEC/CyberTipline raporlarının içeriği dosyadan dosyaya değişir. Platform tarafından gönderilen teknik veriler arasında IP adresi bulunabilir; bazı raporlarda bağlantıya ilişkin daha ayrıntılı bilgiler de yer alabilir.

Türkiye'de bu veriler üzerinden abone tespiti yapılırken kullanılan internet altyapısı önem taşır.

Örneğin NCMEC raporunda yalnız genel IP ve zaman bilgisi varsa, servis sağlayıcının bu IP'yi olay anında tek bir aboneye mi yoksa CGNAT üzerinden çok sayıda aboneye mi kullandırdığı araştırılmalıdır.

Bu nedenle [NCMEC raporunun delil değerini](/makaleler/ncmec-raporu-tek-basina-mahkumiyet-yeterli-mi/) incelerken yalnız raporun içeriğine değil, rapordan Türkiye'deki kişiye ulaşılırken kullanılan teknik eşleştirme yöntemine de bakılır.

## CGNAT kaydı aboneyi gösterirse fail de belirlenmiş olur mu?

Hayır. Burada da önceki bölümdeki ayrım geçerlidir.

CGNAT kaydı doğru biçimde eşleştirildiğinde belirli internet bağlantısının hangi abonelik üzerinden kullanıldığını gösterebilir. Fakat o bağlantıyı olay anında hangi kişinin kullandığı ayrı sorudur.

Fail bağlantısı için;

- kullanıcı hesabı,
- cihaz kayıtları,
- olayla ilişkili dosyalar,
- uygulama oturumları,
- e-posta ve telefon bilgileri,
- ortak ağın kullanım biçimi

önem taşıyabilir.

Bu nedenle CGNAT teknik olarak **abone tespitini** güçlendirir; ceza hukukundaki **fail tespitinin tamamını** tek başına bitirmez.

## Servis sağlayıcı cevabında neler görülmelidir?

Bir ceza dosyasındaki servis sağlayıcı cevabı değerlendirilirken en az şu hususların açık olması önemlidir:

- sorgulanan genel IP adresi,
- sorgulanan tarih ve saat,
- varsa kaynak port,
- zaman dilimi,
- tespit edilen abonelik,
- kaydın hangi teknik log üzerinden üretildiği.

Eğer aynı IP'nin CGNAT kapsamında kullanıldığı biliniyorsa ve kaynak port olmadan doğrudan abone tespiti yapılmışsa, bu sonucun teknik dayanağının ayrıca açıklanması gerekebilir.

## Hatalı CGNAT eşleştirmesi nasıl fark edilir?

Dosyada farklı teknik kayıtlar birbirini tutmuyorsa soru işareti oluşabilir.

Örneğin;

- platformun işlem saati ile servis sağlayıcı sorgusunun saati farklıysa,
- kaynak port platform kaydında bulunduğu hâlde servis sağlayıcı cevabında kullanılmamışsa,
- aynı IP aynı zaman aralığında farklı abonelerle ilişkilendirilebiliyorsa,
- olayla ilişkilendirilen hesap veya cihaz tespit edilen kişiye ait görünmüyorsa

teknik eşleştirmenin nasıl yapıldığı yeniden incelenmelidir.

Bu noktada bilirkişi incelemesi, ham kayıtların değerlendirilmesi ve kayıt zincirinin açıklanması önem kazanabilir.

## CGNAT verisi ile cihaz incelemesi nasıl birleşir?

Bu serinin ilk yarısında NCMEC raporundan ve IP verisinden kişiye ulaşılması tartışıldı. Ancak dijital soruşturma çoğu zaman abonelik tespitiyle bitmez.

İkinci aşamada şüphelinin telefon veya bilgisayarında;

- ilgili hesabın kullanılıp kullanılmadığı,
- bildirime konu içeriğin bulunup bulunmadığı,
- olay zamanına ilişkin teknik izlerin mevcut olup olmadığı

araştırılabilir.

İşte burada ceza soruşturması fail tespitinden **dijital delilin elde edilme usulüne** geçer.

Bu nedenle serinin [bir sonraki bölümünde CMK 134 kapsamında bilgisayar ve telefonda arama, kopyalama ve el koyma şartları](/makaleler/cmk-134-bilgisayar-telefon-arama-kopyalama-el-koyma/) ele alınmaktadır.

<div class="cyber-note"><strong>CGNAT dosyasında üç ayrı soruyu birbirine karıştırmamak gerekir.</strong><br>Genel IP hangi bağlantıyı gösteriyor? Kaynak port ve zaman bilgisi hangi aboneliği ayırıyor? Bu aboneliği olay anında kullanan kişinin kim olduğu hangi başka delillerle ortaya konuluyor?</div>

## Sonuç

CGNAT, aynı genel IP adresinin aynı anda çok sayıda abone tarafından kullanılabilmesine imkân verir. Bu nedenle ceza soruşturmasında yalnız genel IP adresinden hareketle doğrudan kişi tespiti yapmak bazı dosyalarda teknik olarak yetersiz kalabilir.

Sağlıklı bir eşleştirme için **genel IP, kaynak port, doğru tarih-saat ve servis sağlayıcı loglarının** birlikte değerlendirilmesi gerekir.

Fakat bunlar doğru eşleşse bile elde edilen sonuç çoğu zaman abonelik tespitidir. Failin kim olduğu; hesap, cihaz ve diğer dijital delillerle ayrıca ortaya konulur.

Bu yüzden bir CGNAT dosyasında kritik soru yalnız “IP kimin?” değildir:

**Bu bağlantı hangi port ve hangi anda hangi aboneye tahsis edilmişti ve o abonelikle somut fiili gerçekleştiren kişi arasında hangi delil bağı kurulmuştu?**
