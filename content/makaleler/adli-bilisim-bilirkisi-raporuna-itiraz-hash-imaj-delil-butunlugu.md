---
title: "Adli Bilişim Bilirkişi Raporuna Nasıl İtiraz Edilir? Eksik İnceleme, Hash, İmaj ve Delil Bütünlüğü"
slug: "adli-bilisim-bilirkisi-raporuna-itiraz-hash-imaj-delil-butunlugu"
date: "2026-09-08T22:07:00+03:00"
updated: "2026-09-08T22:07:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "Adli Bilişim Bilirkişi Raporuna İtiraz"
summary: "Adli bilişim raporuna etkili itiraz, yalnız sonuca katılmamak değil; veri kaynağını, imaj alma yöntemini, hash kayıtlarını, dosya konumlarını, zaman verilerini ve bilirkişinin ulaştığı sonucun yeniden denetlenebilirliğini somutlaştırmaktır."
seo_title: "Adli Bilişim Bilirkişi Raporuna İtiraz Nasıl Yapılır?"
description: "Adli bilişim bilirkişi raporuna nasıl itiraz edilir? CMK 67, yeni bilirkişi, uzman mütalaası, hash, imaj, eksik inceleme, delil bütünlüğü ve teknik çelişkiler."
series_id: "ncmec-dijital-delil"
series_order: 11
sources:
  - name: "İsmail Akkaya, Bilgisayarlarda, Bilgisayar Programlarında ve Kütüklerinde Arama, Kopyalama ve Elkoyma (CMK m. 134), 1. Baskı, 2024."
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
  - name: "5271 sayılı Ceza Muhakemesi Kanunu, m. 63, m. 67 ve m. 217."
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5271.pdf"
  - name: "6754 sayılı Bilirkişilik Kanunu."
    url: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6754.pdf"
---

## Kısa cevap: Adli bilişim raporuna itiraz nasıl kurulmalıdır?

**Adli bilişim bilirkişi raporuna etkili itiraz, “raporu kabul etmiyoruz” demekten ibaret değildir.** Raporun hangi veriyi hangi yöntemle incelediği, hangi teknik sonuca nasıl ulaştığı ve bu sonucun başka bir uzman tarafından yeniden denetlenip denetlenemediği somut biçimde gösterilmelidir.

Dijital dosyalarda bir rapor çoğu zaman ceza dosyasının en teknik belgesidir. Fakat teknik görünmesi, içindeki her sonucun kendiliğinden doğru veya hukuken bağlayıcı olduğu anlamına gelmez.

Serinin önceki iki bölümünde [adli imaj ve hash değerini](/makaleler/adli-imaj-hash-degeri-nedir-dijital-delil-degistirildi-mi/) ve [cihaza el koyma ile veri kopyalama arasındaki farkı](/makaleler/bilgisayar-telefon-el-koyma-imaj-sonrasi-cihaz-iadesi/) ele aldık. Bilirkişi raporuna itiraz tam bu iki katmanı birleştirir:

**Delil nasıl elde edildi ve bilirkişi o delilden hangi teknik sonuca nasıl ulaştı?**

## Bilirkişi raporu hâkimi bağlar mı?

Hayır.

Ceza muhakemesinde bilirkişi, çözümü uzmanlık, özel veya teknik bilgiyi gerektiren konularda görüş sunar. Nihai hukuki değerlendirme mahkemeye aittir.

CMK m.67/3 de bilirkişinin, uzmanlık alanını aşarak hâkimin yapması gereken hukuki nitelendirme ve değerlendirmelerde bulunamayacağını düzenler.

Bu nedenle adli bilişim raporunda örneğin;

> “Sanık müstehcenlik suçunu işlemiştir.”

şeklinde doğrudan hukuki sonuç kurulması ile;

> “Şu hash değerine sahip dosya şu klasörde tespit edilmiştir.”

şeklinde teknik bulgu açıklanması aynı şey değildir.

Bilirkişinin görevi teknik olguyu ortaya koymak ve uzmanlık alanındaki sonucu açıklamaktır. Hangi suçun oluştuğu, kastın bulunup bulunmadığı ve sanığın cezai sorumluluğu mahkemenin hukuki değerlendirmesidir.

## Bilirkişi raporuna itiraz süresi kaç gündür?

Ceza muhakemesinde bu konu HMK'daki iki haftalık bilirkişi itiraz süresiyle karıştırılmamalıdır.

CMK m.67/5, bilirkişi incelemesi tamamlandığında Cumhuriyet savcısına, katılana, vekiline, şüpheli veya sanığa, müdafiine ya da kanuni temsilciye **itirazlarını bildirmeleri veya yeni bilirkişi incelemesi istemeleri için süre verilmesini** öngörür.

Kanun, ceza yargılaması bakımından herkese uygulanacak sabit bir “iki hafta” kuralı koymaz. Bu nedenle dosyada mahkeme veya ilgili merci tarafından verilen sürenin takip edilmesi gerekir.

Aynı fıkraya göre yeni bilirkişi incelemesi veya itiraz talebi reddedilirse bu hususta **üç gün içinde gerekçeli karar** verilmesi öngörülmüştür.

Bu ayrım SEO bakımından küçük, uygulama bakımından büyük bir ayrıntıdır: **“CMK bilirkişi raporuna itiraz süresi iki haftadır” şeklindeki genelleme doğru değildir.**

## İtirazın ilk adımı: Bilirkişi hangi veri üzerinde çalıştı?

Raporun sonucunu tartışmadan önce veri kaynağını belirlemek gerekir.

Şu sorular cevaplanabilmelidir:

- İncelenen cihaz hangisidir?
- Orijinal cihaz üzerinde mi çalışılmıştır?
- Adli imaj veya başka bir kopya oluşturulmuş mudur?
- İmajın veya kopyanın hash değeri nedir?
- Bilirkişi hangi kopyayı incelemiştir?
- Veri alma işlemi hangi yöntem ve araçla yapılmıştır?

Eğer rapor “hard disk incelendi” veya “telefon içeriği analiz edildi” demekle yetiniyor; hangi veri kümesinin incelendiğini göstermiyorsa, teknik sonucun yeniden denetlenebilirliği zayıflayabilir.

Etkili itiraz burada “hash yok” sloganına değil, **incelenen verinin kimliğinin ve bütünlüğünün nasıl doğrulandığına** odaklanır.

## İkinci adım: Dosyanın bulunduğu yer açıklanmış mı?

Dijital bir dosyanın cihazda bulunması kadar **nerede bulunduğu** da önemlidir.

Aynı görüntü;

- kullanıcının aktif indirme klasöründe,
- WhatsApp veya Telegram medya klasöründe,
- geçici uygulama verisinde,
- bulut senkronizasyon klasöründe,
- silinmiş alandan kurtarılmış parça olarak,
- eski bir yedek içinde

bulunabilir.

Bu teknik bağlam özellikle bilinçli bulundurma, paylaşma veya indirme iddiası bakımından önem taşır.

Raporda yalnız “X adet görüntü bulundu” yazıyor fakat dosya yolları, aktif/silinmiş veri ayrımı ve hangi uygulamayla ilişkilendirildiği açıklanmıyorsa, rapor sonucun hukuki önemini değerlendirmek için yetersiz kalabilir.

## Üçüncü adım: Zaman verileri doğru yorumlanmış mı?

Dijital incelemelerde tarih ve saat alanları kolayca yanlış okunabilir.

Dosyanın oluşturulma zamanı, değiştirilme zamanı, erişim zamanı, mesajlaşma uygulamasındaki gönderim zamanı ve platform logundaki UTC zamanının hepsi aynı şeyi ifade etmeyebilir.

Bu nedenle bilirkişi raporunda;

- hangi zaman alanının kullanıldığı,
- zaman diliminin ne olduğu,
- cihaz saatinin doğru olup olmadığı,
- senkronizasyon veya yedek geri yükleme ihtimalinin zamanı etkileyip etkilemediği

önem taşıyabilir.

Özellikle IP/CGNAT, NCMEC ve cihaz verisinin aynı olayda eşleştirildiği dosyalarda birkaç saatlik veya birkaç saniyelik hata yanlış teknik zincir kurulmasına neden olabilir.

## Dördüncü adım: Aktif dosya ile silinmiş veri ayrılmış mı?

Bu ayrım çoğu raporda kritik önemdedir.

Aktif klasörde duran, kullanıcı tarafından erişilebilir bir dosya ile ayrılmamış alandan kurtarılan silinmiş veri parçası aynı teknik durumda değildir.

Silinmiş dosya;

- geçmişte cihazda bulunmuş olabilir,
- uygulama önbelleğinden kalmış olabilir,
- yedek veya senkronizasyon sürecinden gelmiş olabilir,
- yalnız parçalı biçimde kurtarılmış olabilir.

Bu nedenle bilirkişi “dosya bulundu” dediğinde, **aktif mi, silinmiş mi, tam mı, parçalı mı, hangi dosya sisteminden kurtarıldı?** soruları ayrıca önem kazanır.

Serinin [sonraki bölümünde silinmiş dosya ve mesajların ceza davasındaki delil değerini](/makaleler/silinmis-dosya-mesajlar-dijital-delil-ceza-davasi/) ayrıca ele alıyoruz.

## Beşinci adım: NCMEC veya platform dosyasıyla teknik eşleşme yapılmış mı?

NCMEC dosyalarında yalnız cihazda benzer görüntü bulunması ile rapordaki materyalin aynı olduğunun gösterilmesi birbirinden ayrılmalıdır.

Serinin önceki bölümlerinde değindiğimiz Yargıtay yaklaşımında, NCMEC raporunda bulunan görüntüler ile sanığın hard diskinde bulunan görüntülerin aynı olup olmadığının bilirkişi incelemesiyle belirlenmesi önemlidir.

Bu nedenle raporda;

- hangi NCMEC dosyasının karşılaştırıldığı,
- cihazdaki hangi dosyayla eşleştirildiği,
- hash değerlerinin karşılaştırılıp karşılaştırılmadığı,
- yalnız görsel benzerliğe mi yoksa teknik tanımlayıcıya mı dayanıldığı

açıklanabilmelidir.

“Görüntüler aynıdır” sonucu teknik yöntemi açıklanmadan bırakılmışsa, itirazın hedefi sonucun kendisi kadar **sonuca ulaşma yöntemidir.**

## Bilirkişi kullandığı yazılımı ve yöntemi açıklamak zorunda mı?

Raporun her satırında teknik laboratuvar günlüğü bulunması gerekmez. Ancak başka bir uzmanın sonucu denetleyebilmesi için kullanılan yöntemin yeterince anlaşılır olması gerekir.

Özellikle;

- hangi adli bilişim yazılımının kullanıldığı,
- veri çıkarım türü,
- hangi arama veya filtrelerin uygulandığı,
- silinmiş verinin nasıl kurtarıldığı,
- hash karşılaştırmasının nasıl yapıldığı

sonucu etkiliyorsa bu bilgiler önem kazanır.

Bir raporun “X yazılımında inceleme yapıldı ve sonuç budur” demesi, kullanılan aracın ürettiği teknik bulguların neden o hukuki sonuca işaret ettiğini tek başına açıklamayabilir.

## Eksik inceleme nasıl gösterilir?

Eksik inceleme iddiası mümkün olduğunca somut kurulmalıdır.

Örneğin;

- NCMEC raporundaki dosya ile cihazdaki dosya karşılaştırılmamışsa,
- cihazda birden fazla kullanıcı profili olmasına rağmen hangi profil kullanıldığı incelenmemişse,
- otomatik indirme ayarları tartışıldığı hâlde uygulama verisi incelenmemişse,
- dosyanın silinmiş olduğu belirtilmiş fakat silinme biçimi ve konumu açıklanmamışsa,
- IP kaydı cihazla ilişkilendirilmeden fail sonucu kurulmuşsa,
- zaman dilimi farkı kontrol edilmemişse

itiraz, “rapor eksik” demekten çıkar ve **eksikliğin hangi sonuca neden güvenilemeyeceğini** gösterir.

Bu, adli bilişim itirazının en güçlü biçimidir.

## Çelişkili bilirkişi raporlarında ne yapılabilir?

Bir dosyada farklı teknik raporlar aynı veriden farklı sonuçlara ulaşabilir.

Bu durumda yalnız raporların sonuç bölümlerini karşılaştırmak yerine;

- aynı veri kümesini mi inceledikleri,
- aynı imajı mı kullandıkları,
- aynı hash değerlerini mi esas aldıkları,
- veri alma yöntemlerinin aynı olup olmadığı,
- farklı zaman veya dosya yolu yorumlarının bulunup bulunmadığı

araştırılmalıdır.

Çelişki teknik yöntemden kaynaklanıyorsa yeni bilirkişi incelemesi, ek rapor veya bağımsız uzman görüşü anlamlı hâle gelebilir.

## Yeni bilirkişi incelemesi istenebilir mi?

Evet.

CMK m.67/5 açıkça yeni bilirkişi incelemesi yapılması için istemde bulunulabilmesini düzenler.

Yeni inceleme talebi, yalnız “raporu beğenmedik” gerekçesine değil; mevcut rapordaki somut teknik eksiklik, çelişki veya denetlenebilirlik sorununa dayanırsa çok daha güçlü kurulur.

Örneğin ilk bilirkişi yalnız ekran görüntülerini incelemiş fakat orijinal adli imaj üzerinde dosya yolu ve metadata değerlendirmesi yapmamışsa, yeni incelemenin hangi sorulara cevap vermesi gerektiği açıkça belirtilebilir.

## Uzman mütalaası alınabilir mi?

CMK m.67/6, Cumhuriyet savcısı, katılan, vekili, şüpheli veya sanık, müdafii ya da kanuni temsilcinin yargılama konusu olay veya bilirkişi raporu hakkında **uzmanından bilimsel mütalaa** alabilmesine imkân tanır.

Bu özellikle adli bilişim dosyalarında değerlidir. Çünkü teknik itirazların hukukçu tarafından doğru formüle edilmesi kadar, veri yapısının bir adli bilişim uzmanı tarafından yeniden değerlendirilmesi de gerekebilir.

Ancak kanun, yalnız uzman mütalaası alınacak olması nedeniyle ayrıca süre istenemeyeceğini de düzenler. Bu nedenle mahkemece verilen itiraz süresi içinde hareket etmek önemlidir.

## Bilirkişinin hukuki yorum yapması neden itiraz sebebi olabilir?

CMK m.67/3, bilirkişinin çözümü uzmanlığı, özel veya teknik bilgiyi gerektiren hususlar dışında açıklama yapamayacağını; hâkim tarafından yapılması gereken hukuki nitelendirme ve değerlendirmelerde bulunamayacağını söyler.

Adli bilişim raporunda;

- “sanık suç işlemiştir”,
- “kastı vardır”,
- “TCK 226/3 oluşmuştur”

gibi sonuçlar teknik uzmanlık sınırını aşabilir.

Bilirkişi dosyanın ne olduğunu, nerede bulunduğunu, hangi kullanıcı hesabıyla ilişkili olduğunu ve hangi teknik kayıtların bulunduğunu açıklayabilir. **Bu bulgulardan suçun hukuki unsurlarının oluşup oluşmadığına karar vermek mahkemenin görevidir.**

## Rapora itiraz ederken hangi talepler açıkça yazılabilir?

Somut dosyaya göre itirazın sonunda ne istendiği belirgin olmalıdır.

Örneğin;

- eksik konular hakkında ek rapor alınması,
- yeni bilirkişi veya bilirkişi heyeti görevlendirilmesi,
- orijinal adli imajın yeniden incelenmesi,
- belirli hash değerlerinin karşılaştırılması,
- NCMEC/platform dosyalarıyla teknik eşleştirme yapılması,
- silinmiş/aktif veri ayrımının açıklanması,
- kullanıcı profilleri ve uygulama kayıtlarının incelenmesi,
- bilirkişinin duruşmada açıklama yapması,
- CMK m.67/6 kapsamında sunulan uzman mütalaasının değerlendirilmesi

talep edilebilir.

İtirazın gücü, talebin de teknik soruna uygun kurulmasına bağlıdır.

<div class="cyber-note"><strong>Adli bilişim raporuna itirazın omurgası “sonuç yanlış” cümlesi değildir.</strong><br>Hangi veri incelendi? Veri bütünlüğü nasıl korundu? Dosya nerede bulundu? Zaman nasıl okundu? Sonuca hangi yöntemle ulaşıldı? Başka bir uzman aynı kopyadan aynı sonucu üretebilir mi? Etkili itiraz bu soruların eksik bırakıldığı noktaları gösterir.</div>

## Sonuç

Adli bilişim bilirkişi raporu teknik bir belge olsa da eleştiriden bağışık değildir. Raporun güçlü olması için yalnız sonuç üretmesi değil, **sonuca giden teknik yolu denetlenebilir biçimde göstermesi** gerekir.

Bu nedenle bir itirazın en verimli sırası şöyledir:

**Veri kaynağı → imaj/kopya → hash ve bütünlük → dosya konumu → zaman verisi → kullanıcı bağlantısı → teknik yöntem → hukuki sınır.**

Bu zincirden hangi halka eksikse, itiraz o eksikliğin raporun sonucunu nasıl etkilediğini somutlaştırmalıdır.

Serinin bir sonraki bölümünde, bilirkişi raporlarında en sık yanlış yorumlanan veri türlerinden birine geçiyoruz: [Silinmiş dosya ve mesajlar ceza davasında dijital delil olabilir mi?](/makaleler/silinmis-dosya-mesajlar-dijital-delil-ceza-davasi/)
