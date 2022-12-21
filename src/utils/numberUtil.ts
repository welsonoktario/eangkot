export const rupiah = (number: number) => `Rp ${number.toLocaleString('id-ID')}`

export const calculateOngkos = (jarak: number) => {
  if (jarak == 0) {
    return 0
  }

  if (jarak <= 15000) {
    return 6500
  } else {
    const jarakLebih = (jarak - 15000) / 1000

    return 6500 + (500 * Math.ceil(jarakLebih))
  }
}
