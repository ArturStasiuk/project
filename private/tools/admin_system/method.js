class METHOD {
        constructor(parent) {

            this.parent = parent;
        }
    
    /** czy jest dostemp do modulu */
    async isAccessOpenWindow() {
        const odp = await this.parent.api.getAccessTables('company');
        return odp.access_table;
    }
    /** pobranie danych firm */
    async getCompanyData(data = null) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getAllCompanyData', param: {data} });
        return odp.data;
    }
     /** pobranie  dostepu meniu w oknie zarzadzaj firmami */
    async accessMenu_Window_ZarzadzajFirmami() {
        const odp = await this.parent.api.getAccessTables('company');
        return {
            "read": !!odp.read_record,
            "create": !!odp.add_record,
            "update": !!odp.update_record,
            "delete": !!odp.delete_record
        };
    }

    /** pobranie danych firmy po ID */
    async getCompanyDataById(id) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getCompanyDataById', param: { id_company: id } });
        return odp.data;
    }
    /** pobranie danych uzytkownikow firmy po ID firmy */
    async getUsersByCompanyId(id) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getUsersByCompanyId', param: { id_company: id } });
        return odp.data;
    }
     
    /** zapis danych firmy do bazy danych */
    async saveCompanyData(companyData) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'saveCompanyData', param: { companyData } });
        if (!odp || typeof odp !== 'object') {
            return { status: false, message: typeof odp === 'string' ? odp : 'Invalid response from server' };
        }
        return odp;
    }
    /** usuniecie firmy po ID */
    async deleteCompanyById(id) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'deleteCompanyById', param: { id_company: id } });
        return odp;
    }

    /** walidacja danych firmi  */
    async validateAndSaveCompanyData(companyData) {
        const data = companyData && typeof companyData === 'object' ? { ...companyData } : {};
        const errors = {};

        const normalize = (value) => {
            if (value === null || value === undefined) return '';
            return typeof value === 'string' ? value.trim() : String(value).trim();
        };

        const t = this.parent?.config?.t || {};
        const fieldLabels = {
            name: t.name || 'name',
            type: t.type || 'type',
            tax_id: t.tax_id || 'tax_id',
            regon: t.regon || 'regon',
            krs: t.krs || 'krs',
            address: t.address || 'address',
            city: t.city || 'city',
            postal_code: t.postal_code || 'postal_code',
            country: t.country || 'country',
            phone: t.phone || 'phone',
            email: t.email || 'email',
            website: t.website || 'website'
        };
        const messages = {
            validation_required: t.validation_required || 'Pole {field} jest wymagane.',
            validation_max_length: t.validation_max_length || 'Pole {field} może mieć maksymalnie {max} znaków.',
            validation_invalid_email: t.validation_invalid_email || 'Pole {field} musi zawierać poprawny adres e-mail.',
            validation_invalid_website: t.validation_invalid_website || 'Pole {field} musi zawierać poprawny adres URL (http:// lub https://).'
        };
        const translate = (key, vars = {}) => {
            let template = messages[key] || '';
            Object.entries(vars).forEach(([name, value]) => {
                template = template.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
            });
            return template;
        };

        const validateLength = (field, value, max) => {
            if (value && value.length > max) {
                errors[field] = translate('validation_max_length', { field: fieldLabels[field], max });
                return false;
            }
            return true;
        };

        const validEmail = (value) => {
            if (!value) return true;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        };

        const validUrl = (value) => {
            if (!value) return true;
            try {
                const url = new URL(value);
                return url.protocol === 'http:' || url.protocol === 'https:';
            } catch (err) {
                return false;
            }
        };

        const cleanedData = {
            id: Number.isInteger(parseInt(data.company_id || data.id)) ? parseInt(data.company_id || data.id) : null,
            name: normalize(data.name),
            type: normalize(data.type),
            active: data.active === '0' || data.active === 0 || data.active === false ? 0 : 1,
            tax_id: normalize(data.tax_id),
            regon: normalize(data.regon),
            krs: normalize(data.krs),
            address: normalize(data.address),
            city: normalize(data.city),
            postal_code: normalize(data.postal_code),
            country: normalize(data.country),
            phone: normalize(data.phone),
            email: normalize(data.email),
            website: normalize(data.website)
        };

        if (!cleanedData.name) {
            errors.name = translate('validation_required', { field: fieldLabels.name });
        } else {
            validateLength('name', cleanedData.name, 255);
        }

        if (!cleanedData.type) {
            errors.type = translate('validation_required', { field: fieldLabels.type });
        } else {
            validateLength('type', cleanedData.type, 100);
        }

        validateLength('tax_id', cleanedData.tax_id, 50);
        validateLength('regon', cleanedData.regon, 50);
        validateLength('krs', cleanedData.krs, 50);
        validateLength('address', cleanedData.address, 255);
        validateLength('city', cleanedData.city, 100);
        validateLength('postal_code', cleanedData.postal_code, 20);
        validateLength('country', cleanedData.country, 100);
        validateLength('phone', cleanedData.phone, 50);
        validateLength('email', cleanedData.email, 100);
        validateLength('website', cleanedData.website, 100);

        if (cleanedData.email && !validEmail(cleanedData.email)) {
            errors.email = translate('validation_invalid_email', { field: fieldLabels.email });
        }

        if (cleanedData.website && !validUrl(cleanedData.website)) {
            errors.website = translate('validation_invalid_website', { field: fieldLabels.website });
        }

        if (Object.keys(errors).length > 0) {
            return { status: false, errors };
        }

        return { status: true, data: cleanedData };
    }



}
export default METHOD;