const fs = require('fs');
let content = fs.readFileSync('services/storageService.ts', 'utf8');

content = content.replace(
  `    } catch (e) {
      console.warn("Error saving to Sheets:", e);
      return false;
    }`,
  `    } catch (e: any) {
      console.warn("Error saving to Sheets:", e);
      alert("Gagal menyimpan ke Google Sheets (Data Siswa): " + e.message);
      return false;
    }`
);

fs.writeFileSync('services/storageService.ts', content);
console.log('Patched alerts');
