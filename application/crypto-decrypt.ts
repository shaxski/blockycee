
import crypto from 'crypto'

const info = {
  "CertificateType": "Type A",
  "CertificationId": "ProCertId-Kai100123123",
  "CertifierId": "Organization AUT",
  "DId": "cwvLF2nBJpVwa1f4nNQF21",
  "ExpiryDate": "2023-11-26",
  "IssueDate": "2023-11-02",
  "PublicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkQUOHTpPjgr0l/TcWlkI\nghJ6Xez9WVYPqUackh9ecQDDKKJsCev8lKwrmI/lJSrw7dNam30hKCGTc5XPcI1k\nkONkie31JfR3LgxMFQeVUGfdeSpG1u1hcKsmc956CCNuqnlMUy1iIxTQoD/LNM9u\n64z/03Neb6dGVtnSstj3cDAPp01IJa7DGMlOTVIVF8FI2FJMX+HauR9yuZ2XdZEL\n6hGKo3mz/xYqGckziCytwtJB6G2/QeJZwXmwkoLkXH4WxH2H8sfqEzm1LvYmZQPj\nxbIxcaItk5JDdhI2rAVbA097OHDW/LKuAFurzkJdWTckNGsPhlA5zZLllz5RDP2g\nDwIDAQAB\n-----END PUBLIC KEY-----\n"
}
const encryptData = "FiT+7R41m5g6RLFwSodM+SUSYdUIoDY7pl9cS896KTvbYdLnt5NO61H+ECnKBmz9x07BfutExifwURkE+ZLgsOBAP6eO6SW2IYmp8/Cl8ooL3vQQBf2+tHWZ5oKtrrDb4E1u3erZjQzk+VZ7CmktkHPttc0Yhv/GIohONhnhxVlLT4FHuOMn+sCeuK66gna33rTnH+pW8cYUts8jALrLA+eHWgD94khhJ8Fg1N7rpY/LkSLHEsVKwlt4BMteYMmUDsz8eg9S8aosNw1dQIG7Ck2locYHSoHhN87+SbXA430KLDn2KdWHnq+dIfsYUtnDsbvMWbavuCG/V72WMDd8Kw=="

const decryptData = crypto.publicDecrypt(info.PublicKey, Buffer.from(encryptData, 'base64'));
console.log( JSON.parse(decryptData.toString()));
