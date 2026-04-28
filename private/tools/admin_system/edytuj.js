class EDYCJA_FIRMY {
    constructor(parent, id_company = null) {
        this.admin = parent;
        this.idCompany = id_company;
        this.nameCompany = null;
        this.daneFirmy = null;
    }

    getWindowId() {
        return 'edytuj_firme_' + (this.idCompany || 'unknown');
    }

    getCardId() {
        return 'edytuj-firme_' + (this.idCompany || 'unknown');
    }

    getFormId() {
        return 'formularz-edytuj-firme_' + (this.idCompany || 'unknown');
    }

    getSaveButtonId() {
        return 'buttonSaveEditedCompany_' + (this.idCompany || 'unknown');
    }

    getCancelButtonId() {
        return 'buttonCancelEditCompany_' + (this.idCompany || 'unknown');
    }
    
    /** otworzenie okna edycji firmy */
    async open(id_company = null) {
        if (id_company) {
            this.idCompany = id_company;
        }
        this.daneFirmy = await this.pobiezDaneFirmy();
        this.nameCompany = this.daneFirmy?.name || null;
        this.idCompany = this.daneFirmy?.id || null;
        await this.showWindows();
    }

    async showWindows() {
        await this.admin.view.addWindow(await this.configWindows());
        await this.admin.view.addWindowCard(await this.configContent());
        // dodanie haldera dla przycikow
        await this.admin.zdarzenia.handleButtonClicks([
            this.getSaveButtonId(),
            this.getCancelButtonId()
        ], async (id) => {
            if (id === this.getSaveButtonId()) {
                await this.saveChanges();
            }
            else if (id === this.getCancelButtonId()) {
                await this.closeWindow();
            }
        });
    }
    
    async saveChanges() {
        // pobranie danych z formularza
        const formData = await this.admin.zdarzenia.getFormData(this.getFormId());
        // walidacja danych
        const validation = await this.admin.method.validateAndSaveCompanyData(formData);
        if (!validation.status) {
            // obsługa błędów walidacji: formularz pozostaje otwarty,
            // czekamy na kolejne kliknięcie "Zapisz" lub "Anuluj"
            const errorsText = Object.values(validation.errors).join('\n');
            const title = this.admin.config?.t?.alert || 'Alert!';
            await this.admin.modal.alert(title, errorsText);
            return;
        }
        // zapis danych firmy do bazy danych
        const saveResult = await this.admin.api.send({modules:'modules_company', method:'update_record',param:{formData: validation.data}});
        if (!saveResult || !saveResult.status) {
            const title = this.admin.config?.t?.alert || 'Alert!';
            const message = saveResult?.message || this.admin.config?.t?.error_generic || 'An error occurred.';
            await this.admin.modal.alert(title, message);
            return;
        }
        // alert o udanym zapisie
        const title = this.admin.config?.t?.success || 'Success!';
        const message = this.admin.config?.t?.company_updated || 'Company updated successfully.';
        await this.admin.modal.alert(title, message);
        // zamknięcie okna po udanym zapisie
              const winConfig = await this.configWindows();
      await this.usunHandlery();
      await this.admin.view.removeWindow({ id: winConfig.id });
    }

    async closeWindow() {
      const confirmed = await this.admin.modal.confirm(
        '',
        this.admin.config.t?.confirm_cancel_edit || 'Anulować edycję?'
      );
      if (!confirmed) {
        return;
      }
      const winConfig = await this.configWindows();
      await this.usunHandlery();
      await this.admin.view.removeWindow({ id: winConfig.id });
    }
   
    async usunHandlery() {
        await this.admin.zdarzenia.removeButtonClicks([
            this.getSaveButtonId(),
            this.getCancelButtonId()
        ]);
    }

    async pobiezDaneFirmy() {
        if (!this.idCompany) {
            return null;
        }
        try {
         const data = await this.admin.method.getCompanyDataById(this.idCompany);
         return data;
        }
        catch (error) {
            await this.admin.modal.alert(
                this.admin.config.t?.alert || 'Alert!',
                this.admin.config.t?.error_generic || 'An error occurred.'
            );
            return null;
        }
    }

    async configWindows() {
        const defaultTitle = this.admin?.config?.t?.menu_edytuj || 'Edytuj firmę';
        const companyTitle = this.daneFirmy?.name ? `${defaultTitle}: ${this.daneFirmy.name}` : defaultTitle;
        return {
            id: this.getWindowId(),
            icon: '✏️',
            title: companyTitle,
            width: 640,
            height: 720
        };
    }
    async configContent() {
        const t = this.admin?.config?.t || {};
        const company = this.daneFirmy || {};
        const value = (field) => company[field] !== null && company[field] !== undefined ? company[field] : '';
        const activeValue = company.active === 0 ? '0' : '1';
        const formStyle = [
            'background: rgba(243,243,243,0.97)',
            'border-radius: 12px',
            'box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(25,118,210,0.08)',
            'padding: 28px 32px 24px 32px',
            'max-width: 520px',
            'margin: 32px auto',
            'font-family: \'Segoe UI Variable\', \'Segoe UI\', Arial, sans-serif',
            'color: #222',
            'border: 1px solid rgba(180,200,230,0.18)',
            'display: flex',
            'flex-direction: column',
            'align-items: stretch',
            'overflow: hidden'
        ].join(';');
        const gridStyle = [
            'display: grid',
            'grid-template-columns: 1fr 1fr',
            'gap: 14px',
            'margin-bottom: 18px'
        ].join(';');
        const labelStyle = [
            'font-size: 1.04rem',
            'font-weight: 500',
            'color: #222',
            'margin-bottom: 2px',
            'display: block'
        ].join(';');
        const inputStyle = [
            'width: 100%',
            'padding: 0.55em 0.9em',
            'border-radius: 6px',
            'border: 1px solid #b4c7e7',
            'background: #f5f7fa',
            'font-size: 1rem',
            'margin-top: 2px',
            'margin-bottom: 0',
            'box-sizing: border-box',
            'transition: border 0.15s, box-shadow 0.15s',
            'outline: none'
        ].join(';');
        const selectStyle = inputStyle;
        const buttonStyle = [
            'padding: 0.6em 2.2em',
            'border-radius: 6px',
            'background: linear-gradient(180deg, #eaf1fb 0%, #d2e3fc 100%)',
            'color: #222',
            'border: 1px solid #b4c7e7',
            'font-size: 1rem',
            'font-family: inherit',
            'cursor: pointer',
            'transition: background 0.15s, border 0.15s, color 0.15s',
            'box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08)',
            'margin-right: 12px',
            'outline: none'
        ].join(';');
        const buttonStyleNo = [
            buttonStyle,
            'background: linear-gradient(180deg, #fbeaea 0%, #fcd2d2 100%)',
            'color: #d32f2f',
            'border: 1px solid #d32f2f'
        ].join(';');

        const formId = this.getFormId();
        const saveButtonId = this.getSaveButtonId();
        const cancelButtonId = this.getCancelButtonId();
        const html = `
        <form id="${formId}" style="${formStyle}">
            <input type="hidden" name="company_id" value="${company.id || ''}">
            <div style="${gridStyle}">
                <div style="grid-column:1/3"><label style="${labelStyle}">${t.name || 'Nazwa firmy'}*<br>
                    <input type="text" name="name" maxlength="255" required placeholder="${t.name || 'Nazwa firmy'}" value="${value('name')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.type || 'Typ firmy'}*<br>
                    <input type="text" name="type" maxlength="100" required placeholder="${t.type || 'Typ firmy'}" value="${value('type')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.active || 'Aktywna'}<br>
                    <select name="active" style="${selectStyle}">
                        <option value="1" ${activeValue === '1' ? 'selected' : ''}>✔️ ${t.active || 'Aktywna'}</option>
                        <option value="0" ${activeValue === '0' ? 'selected' : ''}>❌</option>
                    </select></label></div>
                <div><label style="${labelStyle}">${t.tax_id || 'NIP'}<br>
                    <input type="text" name="tax_id" maxlength="50" placeholder="${t.tax_id || 'NIP'}" value="${value('tax_id')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.regon || 'REGON'}<br>
                    <input type="text" name="regon" maxlength="50" placeholder="${t.regon || 'REGON'}" value="${value('regon')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.krs || 'KRS'}<br>
                    <input type="text" name="krs" maxlength="50" placeholder="${t.krs || 'KRS'}" value="${value('krs')}" style="${inputStyle}"></label></div>
                <div style="grid-column:1/3"><label style="${labelStyle}">${t.address || 'Adres'}<br>
                    <input type="text" name="address" maxlength="255" placeholder="${t.address || 'Adres'}" value="${value('address')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.city || 'Miasto'}<br>
                    <input type="text" name="city" maxlength="100" placeholder="${t.city || 'Miasto'}" value="${value('city')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.postal_code || 'Kod pocztowy'}<br>
                    <input type="text" name="postal_code" maxlength="20" placeholder="${t.postal_code || 'Kod pocztowy'}" value="${value('postal_code')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.country || 'Kraj'}<br>
                    <input type="text" name="country" maxlength="100" placeholder="${t.country || 'Kraj'}" value="${value('country')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.phone || 'Telefon'}<br>
                    <input type="text" name="phone" maxlength="50" placeholder="${t.phone || 'Telefon'}" value="${value('phone')}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.email || 'Email'}<br>
                    <input type="email" name="email" maxlength="100" placeholder="${t.email || 'Email'}" value="${value('email')}" style="${inputStyle}"></label></div>
                <div style="grid-column:1/3"><label style="${labelStyle}">${t.website || 'Strona www'}<br>
                    <input type="url" name="website" maxlength="100" placeholder="${t.website || 'Strona www'}" value="${value('website')}" style="${inputStyle}"></label></div>
            </div>
            <div style="margin-top:18px;text-align:right;">
                <button id="${saveButtonId}" type="button" style="${buttonStyle}">${t.zapisz || 'Zapisz'}</button>
                <button id="${cancelButtonId}" type="button" style="${buttonStyleNo};margin-left:8px;">${t.anuluj || 'Anuluj'}</button>
            </div>
        </form>
        `;
        return {
            id: this.getWindowId(),
            cardId: this.getCardId(),
            title: t.menu_edytuj || 'Edytuj firmę',
            text: html
        };
    }
}

export default EDYCJA_FIRMY;