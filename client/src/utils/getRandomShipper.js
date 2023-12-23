
export default function getRandomShipper() {
    const shipperList = [
        'UPS',
        'FedEx',
        'DHL',
        'USPS',
        'Amazon Logistics',
        'OnTrac',
        'LaserShip',
        'Eastern Connection',
        'Estes Express Lines',
        'XPO Logistics',
    ]
    const randomIndex = () => {
        return Math.floor(Math.random() * shipperList.length)
    }
    const randomShipper = shipperList[randomIndex()]
    return randomShipper
}