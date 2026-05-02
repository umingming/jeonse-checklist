(() => {
    const STORAGE_KEY = 'jeonse-checklist-data';

    // Toggle button selection
    document.querySelectorAll('.btn-group').forEach(group => {
        group.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = group.querySelector('.selected');
                if (selected === btn) {
                    btn.classList.remove('selected');
                } else {
                    if (selected) selected.classList.remove('selected');
                    btn.classList.add('selected');
                }
                saveData();
            });
        });
    });

    // Save to localStorage
    function saveData() {
        const data = {
            info: {
                address: document.getElementById('address').value,
                deposit: document.getElementById('deposit').value,
                rent: document.getElementById('rent').value,
                maintenance: document.getElementById('maintenance').value,
                contractPeriod: document.getElementById('contract-period').value,
                moveInDate: document.getElementById('move-in-date').value,
                memo: document.getElementById('memo').value,
            },
            checks: []
        };

        document.querySelectorAll('.check-item').forEach(item => {
            const selected = item.querySelector('.btn-group .selected');
            data.checks.push(selected ? selected.dataset.value : null);
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Load from localStorage
    function loadData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);

        if (data.info) {
            document.getElementById('address').value = data.info.address || '';
            document.getElementById('deposit').value = data.info.deposit || '';
            document.getElementById('rent').value = data.info.rent || '';
            document.getElementById('maintenance').value = data.info.maintenance || '';
            document.getElementById('contract-period').value = data.info.contractPeriod || '';
            document.getElementById('move-in-date').value = data.info.moveInDate || '';
            document.getElementById('memo').value = data.info.memo || '';
        }

        if (data.checks) {
            document.querySelectorAll('.check-item').forEach((item, i) => {
                if (data.checks[i]) {
                    const btn = item.querySelector(`[data-value="${data.checks[i]}"]`);
                    if (btn) btn.classList.add('selected');
                }
            });
        }
    }

    // Auto-save on input change
    document.querySelectorAll('.info-grid input, .info-grid textarea').forEach(el => {
        el.addEventListener('input', saveData);
    });

    // Save as image
    document.getElementById('save-image').addEventListener('click', () => {
        const area = document.getElementById('checklist-area');
        html2canvas(area, {
            scale: 2,
            backgroundColor: '#f5f5f5',
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            const address = document.getElementById('address').value || '매물';
            link.download = `전세체크_${address}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // Reset
    document.getElementById('reset-all').addEventListener('click', () => {
        if (!confirm('모든 내용을 초기화할까요?')) return;
        localStorage.removeItem(STORAGE_KEY);
        document.querySelectorAll('.info-grid input, .info-grid textarea').forEach(el => {
            el.value = '';
        });
        document.querySelectorAll('.btn-group .selected').forEach(btn => {
            btn.classList.remove('selected');
        });
    });

    // Load saved data on start
    loadData();
})();
