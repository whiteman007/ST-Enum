// popup.js

// دالة لتحديث رسالة التحميل في الواجهة
function updateLoadingMessage(message) {
    const loadingMessageElement = document.getElementById('loadingMessage');
    if (loadingMessageElement) {
        loadingMessageElement.textContent = message;
    } else {
        console.error('❌ Loading message element not found');
    }
}

// دالة لتحديث قائمة الدومينات في الواجهة مع الترقيم
function updateDomainList(domains, startIndex) {
    const domainListElement = document.getElementById('domainList');
    domainListElement.innerHTML = ''; // مسح المحتوى السابق

    domains.forEach((domain, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${startIndex + index + 1}. ${domain}`; // إضافة ترقيم
        domainListElement.appendChild(listItem);
    });
}

// دالة تأخير التنفيذ (مهمة لتجنب الحظر بسبب كثرة الطلبات)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// حدث الضغط على زر جلب الدومينات
document.getElementById('fetchBtn').addEventListener('click', async () => {
    const domain = document.getElementById('domainInput').value.trim();
    if (!domain) {
        alert('❌ Please enter a domain name.');
        return;
    }

    updateLoadingMessage('Collecting domains...');

    // استدعاء الدالة الموجودة في getBuildId.js لجلب buildId
    const buildId = await getBuildId();
    if (!buildId) {
        alert('❌ Failed to retrieve buildId');
        updateLoadingMessage('❌ Failed to retrieve buildId');
        return;
    }

    const baseURL = `https://securitytrails.com/_next/data/${buildId}/list/apex_domain/${domain}.json`;

    let allDomains = [];
    let currentPage = 1;
    let maxPage = 1;

    try {
        // جلب الصفحة الأولى لمعرفة عدد الصفحات (maxPage)
        const initialResponse = await fetch(`${baseURL}?page=1&domain=${domain}`);
        const initialData = await initialResponse.json();

        console.log("First page response:", initialData);

    if (initialData.pageProps?.apexDomainData?.data?.meta?.total_pages) {
    maxPage = initialData.pageProps.apexDomainData.data.meta.total_pages;
    const estimatedTotal = maxPage * 100;

    console.log(`📌 Max pages: ${maxPage}`);
    updateLoadingMessage(`Max pages: ${maxPage}`);

    // عرض العدد التقديري تحت الرسالة
    const estimatedElement = document.getElementById('estimatedTotal');
    if (estimatedElement) {
        estimatedElement.textContent = `📊 Estimated total domains: ~${estimatedTotal}`;
    }
}


        while (currentPage <= maxPage) {
            const url = `${baseURL}?page=${currentPage}&domain=${domain}`;
            console.log(`🔍 Fetching data from: ${url}`);

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`❌ Failed to fetch from page ${currentPage}. Status: ${response.status}`);
                    alert(`❌ Failed to fetch data from page ${currentPage}. Status: ${response.status}`);
                    break;
                }

                const data = await response.json();

                console.log(`Page ${currentPage} response:`, data);

                if (data.pageProps?.apexDomainData?.data?.records) {
                    const domains = data.pageProps.apexDomainData.data.records.map(record => record.hostname);

                    if (domains.length > 0) {
                        allDomains.push(...domains);
                        console.log(`📄 Page ${currentPage}: Extracted ${domains.length} domains`);
                        updateDomainList(allDomains, 0); // عرض جميع الدومينات مع ترقيم من 1
                    } else {
                        console.warn(`⚠️ Page ${currentPage} contains no domains.`);
                    }
                } else {
                    console.warn(`⚠️ Page ${currentPage} contains no domain data.`);
                }
            } catch (error) {
                console.error(`❌ Error fetching data from page ${currentPage}:`, error);
                alert(`❌ Error occurred while fetching data from page ${currentPage}`);
                break;
            }

            currentPage++;
            updateLoadingMessage(`Collecting domains... ${allDomains.length} domains collected`);

            await delay(12000); // تأخير 12 ثانية بين كل طلب وآخر لتفادي الحظر
        }

        console.log(`✅ Successfully extracted ${allDomains.length} domains!`);
        updateLoadingMessage(`✅ Domains collected successfully! Total: ${allDomains.length}`);
        document.getElementById('downloadBtn').disabled = false; // تفعيل زر التنزيل

    } catch (error) {
        console.error('❌ Failed to fetch data:', error);
        alert('❌ Error occurred while fetching data.');
        updateLoadingMessage('❌ Error occurred while collecting domains');
    }
});

// حدث الضغط على زر التنزيل لتحميل الدومينات في ملف نصي بدون ترقيم
document.getElementById('downloadBtn').addEventListener('click', () => {
    const domainListElement = document.getElementById('domainList');
    const domains = Array.from(domainListElement.getElementsByTagName('li'))
        .map(item => item.textContent.replace(/^\d+\.\s*/, ''));

    if (domains.length > 0) {
        const blob = new Blob([domains.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'domains.txt';
        link.click();
    } else {
        alert('❌ No domains to download.');
    }
});
