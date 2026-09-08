---
title: "NCMEC Raporu Tek Başına Mahkûmiyet İçin Yeterli midir?"
slug: "ncmec-raporu-tek-basina-mahkumiyet-yeterli-mi"
date: "2026-09-08T20:59:00+03:00"
updated: "2026-09-08T21:00:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "NCMEC Delil Değeri"
summary: "Bir NCMEC raporunun varlığı ile rapordaki fiilin belirli bir kişi tarafından işlendiğinin ispatı aynı şey değildir. Raporun içeriği; hesap, IP, cihaz, dosya eşleşmesi ve adli bilişim bulgularıyla birlikte değerlendirilmelidir."
seo_title: "NCMEC Raporu Tek Başına Mahkûmiyet İçin Yeterli mi?"
description: "NCMEC raporu mahkûmiyet için tek başına yeterli mi? IP, hesap, cihaz incelemesi, hash eşleşmesi ve bilirkişi raporunun delil değeri."
series_id: "ncmec-dijital-delil"
series_order: 2
series_prev_title: "NCMEC Raporu Nedir? Türkiye'de Soruşturma Nasıl İlerler?"
series_prev_url: "/makaleler/ncmec-raporu-nedir-turkiyede-sorusturma/"
series_next_title: "Müstehcenlik Suçu ve TCK 226: Dijital İçerikler Nasıl Değerlendirilir?"
series_next_url: "/makaleler/mustehcenlik-sucu-tck-226-dijital-icerikler/"
sources:
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
  - name: "İsmail Akkaya, Bilgisayarlarda, Bilgisayar Programlarında ve Kütüklerinde Arama, Kopyalama ve Elkoyma (CMK m. 134), 1. Baskı, 2024."
  - name: "National Center for Missing & Exploited Children (NCMEC), CyberTipline Data 2025."
    url: "https://ncmec.org/gethelpnow/cybertipline/cybertiplinedata"
---

## Kısa cevap

**NCMEC raporunun varlığı, tek başına ve otomatik biçimde mahkûmiyet anlamına gelmez.** Rapor önemli bir delil veya soruşturma başlangıç verisi olabilir. Fakat ceza sorumluluğu bakımından rapordaki olayın belirli bir kişiyle ve isnat edilen fiille nasıl bağlandığının ortaya konulması gerekir.

Bu ayrım özellikle dijital dosyalarda önemlidir. Çünkü aynı dosyada birbirinden farklı dört bağlantı kurulmaya çalışılır:

**rapor → hesap → internet bağlantısı → gerçek kişi ve cihaz.**

Bu zincirin her halkası aynı güçte olmayabilir. Bazı dosyalarda platformun verdiği hesap ve cihaz verileri çok ayrıntılıdır; bazı dosyalarda ise elde yalnız bir kullanıcı adı, IP veya sınırlı teknik bilgi bulunabilir.

Bu nedenle “NCMEC raporu var” cümlesi, delil değerlendirmesinin sonu değil başlangıcıdır.

## Önce raporun kendisi ne söylüyor?

NCMEC/CyberTipline raporlarının içeriği dosyadan dosyaya değişir. Platformun rapora eklediği kullanıcı bilgileri, tarih ve saatler, IP adresleri, görsel veya video dosyaları ile teknik tanımlayıcıların kapsamı aynı değildir.

NCMEC'in güncel raporlama sisteminde de bütün raporlar aynı işlem kabiliyetine sahip kabul edilmez. NCMEC, kolluğun işlem yapabilmesine yetecek kullanıcı, içerik ve yer bilgisi bulunan raporlarla, daha sınırlı bilgi taşıyan raporları ayırmaktadır.

Bu farklılık ceza dosyasında doğrudan önemlidir. Çünkü bir rapor;

- yalnız bir platform hesabını gösterebilir,
- hesabın kullandığı IP adreslerini de içerebilir,
- bildirime konu dosyaları ekleyebilir,
- dosyaların hash değerlerini veya başka teknik verileri sunabilir,
- platformun kendi incelemesine ilişkin açıklamalar taşıyabilir.

Dolayısıyla raporun ispat değerini değerlendirmeden önce **raporun tamamının görülmesi** gerekir.

## Rapordaki hesap ile sanık arasındaki bağlantı nasıl kurulur?

Bir e-posta adresinin, kullanıcı adının veya sosyal medya hesabının belirli bir kişiye ait görünmesi tek başına bütün soruları çözmez.

Hesabın fiilen kim tarafından kullanıldığını değerlendirmek için örneğin;

- hesap açılış ve kurtarma bilgileri,
- oturum açma kayıtları,
- IP ve tarih-saat verileri,
- telefon numarası veya bağlı cihaz bilgileri,
- cihazlarda bulunan oturum ve uygulama kayıtları,
- diğer hesaplarla bağlantılar

önem taşıyabilir.

Buradaki hukuki sorun, hesabın “kimin adına olduğu” ile sınırlı değildir. **İsnat edilen işlemi suç tarihinde kimin gerçekleştirdiği** belirlenmelidir.

## IP adresi raporu kişiye bağlamak için yeterli midir?

IP adresi önemli bir teknik veridir fakat IP adresi doğrudan insan kimliği değildir.

Dinamik IP tahsisi, CGNAT, ortak internet bağlantısı, aynı ev veya işyerindeki birden fazla kullanıcı ve aynı ağa bağlanan farklı cihazlar nedeniyle IP verisi çoğu zaman başka kayıtlarla birlikte değerlendirilir.

Murat Volkan Dülger'in aktardığı Yargıtay uygulamasında, IP üzerinden ulaşılan kişinin bilgisayar ve diğer elektronik cihazları üzerinde inceleme yapılması; internet servis sağlayıcısından gelen kayıtlarla yetinilmemesi gerektiğini gösteren kararlar bulunmaktadır.

Bu nedenle NCMEC dosyasında yalnız **“bu IP bu abonenin”** sonucuyla yetinmek, fail tespiti bakımından eksik kalabilir. Özellikle CGNAT kullanılan bağlantılarda kaynak port ve doğru zaman verisinin bulunması ayrıca önem kazanır.

IP ve CGNAT meselesi, bu serinin devamında ayrı bir makalede ayrıntılı olarak ele alınacaktır.

## Rapordaki görüntü ile cihazdaki görüntü aynı mı?

NCMEC dosyalarında en kritik sorulardan biri budur.

Dülger'in aktardığı **Yargıtay 4. Ceza Dairesinin 24.12.2020 tarihli, E.2020/14214, K.2020/21479 sayılı kararında**, NCMEC raporunda yer alan görüntüler ile sanığa ait hard diskte tespit edilen görüntülerin aynı olup olmadığının bilirkişi aracılığıyla belirlenmesi gerektiği vurgulanmıştır.

Bu yaklaşım önemli bir ayrımı gösterir:

**“Raporda bir görüntü var”** başka şeydir.  
**“Aynı görüntünün sanığın cihazında bulunduğu teknik olarak gösterildi”** başka şeydir.

Eşleşme; dosyanın kendisi, hash değeri, dosya yapısı veya bilirkişinin denetlenebilir başka teknik bulguları üzerinden kurulabilir. Hangi yöntemin yeterli olacağı somut dosyaya bağlıdır.

## Hash eşleşmesi neyi ispatlar, neyi ispatlamaz?

Hash değeri bir dijital dosyanın teknik parmak izi gibi kullanılabilir. Aynı hash değerine sahip iki dosyanın aynı veri içeriğine sahip olduğu yönünde çok güçlü teknik sonuç verir.

Fakat hash eşleşmesi tek başına **o dosyayı kimin indirdiğini, gördüğünü veya paylaştığını** söylemez.

Örneğin bir dosyanın sanığın cihazında aynı hash ile bulunması dosya eşleşmesini kuvvetle ortaya koyabilir. Fakat ceza sorumluluğu bakımından ayrıca;

- cihazı kimlerin kullandığı,
- dosyanın ne zaman ve hangi uygulama üzerinden geldiği,
- dosyanın otomatik senkronizasyonla oluşup oluşmadığı,
- silinip silinmediği,
- kullanıcı tarafından açılıp taşınıp taşınmadığı,
- başkasına gönderilip gönderilmediği

gibi sorular gündeme gelebilir.

Dijital delilde bu nedenle **dosyanın kimliği** ile **failin kimliği** birbirinden ayrılmalıdır.

## Cihazda hiç eşleşen içerik bulunmaması ne anlama gelir?

Bu durum da otomatik bir beraat formülü değildir. Fakat delil değerlendirmesinde önemli bir olgudur.

Bir rapor, geçmişte gerçekleşmiş bir yükleme veya paylaşımı gösterebilir; dosyanın daha sonra cihazdan silinmiş olması mümkündür. Öte yandan cihaz incelemesinde rapora konu materyalle hiçbir teknik bağlantı kurulamaması, özellikle başka güçlü deliller de yoksa raporun kişiyle bağlantısının ayrıca sorgulanmasını gerektirir.

Dülger'in aktardığı kararlar, IP ile ulaşılan şüphelinin cihazlarında suç konusu içerik bulunup bulunmadığının ve içeriklerin nasıl elde edildiğinin araştırılmasının önemini ortaya koymaktadır.

Burada doğru soru “cihaz temiz çıktı mı?” değil, **“rapordaki olay ile cihaz ve kullanıcı arasındaki bağlantıyı gösteren ne var?”** sorusudur.

## Otomatik indirme veya bulut senkronizasyonu savunması tek başına yeterli midir?

Hayır. Aynı şekilde bu ihtimalin hiç araştırılmaması da doğru değildir.

Mesajlaşma uygulamalarının otomatik medya indirme özellikleri, fotoğraf yedekleme servisleri veya cihazlar arası bulut senkronizasyonu nedeniyle bir dosya kullanıcının elle “kaydet” komutu vermeden cihazda bulunabilir.

Ancak bunun somut dosyada gerçekleşip gerçekleşmediği teknik verilerle incelenmelidir. Uygulama ayarları, dosya yolu, senkronizasyon kayıtları, oluşturma zamanları ve başka dijital bulgular bu değerlendirmede önem taşıyabilir.

Bu nedenle **“otomatik indi”** cümlesi de **“dosya cihazda bulundu, bilinçli olarak saklandı”** cümlesi de teknik incelemeden bağımsız kesin sonuç değildir.

## Dijital incelemenin güvenilirliği de delil değerlendirmesinin parçasıdır

Cihazdan elde edilen bulguların güvenilir biçimde değerlendirilebilmesi için dijital incelemenin yönteminin denetlenebilir olması gerekir.

İsmail Akkaya'nın çalışmasında dijital delilin klasik delilden farklı özellikleri, adli bilişim metodolojisi ve CMK m.134 kapsamındaki arama-kopyalama-el koyma işlemleri ayrıntılı biçimde ele alınmaktadır. İmaj alma, kopya üzerinde inceleme ve veri bütünlüğünün korunması bu nedenle yalnız teknik ayrıntı değil, delilin güvenilirliğiyle ilgili hukuki meselelerdir.

Bir bilirkişi raporunda yalnız “X adet dosya bulundu” yazması her zaman bütün soruları cevaplamaz. Dosyaların nerede ve nasıl bulunduğu, rapordaki materyalle eşleşip eşleşmediği ve incelemenin yeniden denetlenebilir olup olmadığı da önemlidir.

## NCMEC raporu hangi durumda güçlü bir delil zincirinin parçası hâline gelir?

Tek bir formül yoktur. Ancak örneğin şu verilerin birbirini doğrulaması delil zincirini belirgin biçimde güçlendirebilir:

1. NCMEC raporunda belirli hesap ve dosya bilgileri bulunması,
2. platform kayıtlarının aynı hesabı ve tarihleri doğrulaması,
3. IP/port verilerinin ilgili internet bağlantısıyla eşleşmesi,
4. hesabın şüpheli tarafından kullanıldığını gösteren cihaz kayıtlarının bulunması,
5. rapordaki materyalin aynı veya ilişkili biçimde cihazda tespit edilmesi,
6. dijital incelemenin güvenilir ve denetlenebilir yöntemlerle yapılması.

Tersine, bu halkaların bir veya birkaçında ciddi boşluk bulunması ispat değerlendirmesini değiştirebilir.

## Sonuç

NCMEC raporu hafife alınacak bir belge değildir. Fakat **raporun ciddi olması ile raporun tek başına mahkûmiyet için yeterli olması aynı önerme değildir.**

Ceza dosyasındaki asıl soru, raporun içeriğinin sanığın belirli bir eylemi gerçekleştirdiğini başka delillerle birlikte ne ölçüde ortaya koyduğudur.

Bu nedenle NCMEC dosyalarında rapor, hesap verileri, IP ve port kayıtları, cihaz incelemesi, dosya eşleşmesi, hash değerleri ve bilirkişi raporu birbirinden kopuk okunmamalıdır.

Serinin bir sonraki bölümünde, bu raporların Türkiye'de en sık bağlandığı suç tiplerinden biri olan [TCK m.226 kapsamındaki müstehcenlik suçunun dijital içerikler bakımından nasıl uygulandığını](/makaleler/mustehcenlik-sucu-tck-226-dijital-icerikler/) ele alıyoruz.

## Sık sorulan sorular

### NCMEC raporu delil midir?

Ceza soruşturmasında delil veya araştırma başlangıç verisi olarak dosyaya girebilir. Ancak delil değeri raporun içeriğine ve diğer bulgularla nasıl doğrulandığına göre değişir.

### Raporda benim IP adresim varsa mahkûmiyet çıkar mı?

IP adresi tek başına kişinin suçu işlediğini otomatik olarak göstermez. IP tahsisi, zaman ve port verileri, bağlantıyı kullanan kişiler ve cihaz incelemesi birlikte değerlendirilebilir.

### NCMEC raporundaki dosya telefonda bulunmadıysa dosya kapanır mı?

Otomatik olarak değil. Ancak rapor ile şüpheli arasındaki bağlantının hangi başka delillerle kurulduğu önem kazanır. Cihaz incelemesinde eşleşen içerik bulunmaması somut olayın tamamıyla birlikte değerlendirilir.

### Bilirkişi raporunda yalnız dosya sayısının yazması yeterli midir?

Her dosyada aynı cevap verilemez. NCMEC raporundaki materyalle eşleşme tartışmalıysa, hangi dosyanın nerede bulunduğunu ve karşılaştırmanın hangi teknik yöntemle yapıldığını gösterebilen denetlenebilir bir inceleme önemlidir.
