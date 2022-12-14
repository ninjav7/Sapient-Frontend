import { sanitizeNumbers } from '../helper';

describe('Test Sanitize numbers', () => {
    it('allow -1', () => {
        expect(sanitizeNumbers('-1')).toEqual(-1);
    });
    it('allow -100', () => {
        expect(sanitizeNumbers('-100')).toEqual(-100);
    });
    it('allow +100', () => {
        expect(sanitizeNumbers('+100')).toEqual(+100);
    });
    it('restrict pppp', () => {
        expect(sanitizeNumbers('pppp')).toEqual('');
    });
    it('restrict __', () => {
        expect(sanitizeNumbers('__')).toEqual('');
    });
    it('restrict /', () => {
        expect(sanitizeNumbers('/')).toEqual('');
    });
    it('restrict *', () => {
        expect(sanitizeNumbers('*')).toEqual('');
    });
    it('reduce 0000 -> 0', () => {
        expect(sanitizeNumbers('0000')).toEqual(0);
    });
    it('allow -', () => {
        expect(sanitizeNumbers('-')).toEqual('-');
    });
    it('reduce 0- -> -', () => {
        expect(sanitizeNumbers('0-')).toEqual('-');
    });
    
    it('restricted -2 by min 0', () => {
        expect(sanitizeNumbers('-2', 0)).toEqual(0);
    });
    it('allowed -2 by min -2', () => {
        expect(sanitizeNumbers('-2', -2)).toEqual(-2);
    });
    it('restricted -2 by min -1', () => {
        expect(sanitizeNumbers('-2', -1)).toEqual(0);
    });
    it('allowed -2 by min -3', () => {
        expect(sanitizeNumbers('-2', -3)).toEqual(-2);
    });

    it('allowed', () => {
        expect(sanitizeNumbers('2', 0)).toEqual(2);
    });
    it('allowed', () => {
        expect(sanitizeNumbers('2')).toEqual(2);
    });
});
