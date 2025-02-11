const pdfMake = require('pdfmake/build/pdfmake'); // Importa pdfmake
const pdfFonts = require('pdfmake/build/vfs_fonts'); // Importa pdfmake
pdfMake.vfs = pdfFonts.vfs;
const nodeMailer = require('nodemailer');

async function generatePdf(pdfDefinition) {
    return new Promise((resolve, reject) => {
        const pdfDoc = pdfMake.createPdf(pdfDefinition);
        pdfDoc.getBuffer((buffer) => {
            resolve(buffer);
        });
    });
}

async function enviarCorreoPrueba(req, res) {
    let body = req.body;
    const total = body.productos.reduce((acc, item) => acc + parseFloat(item.PRECIO), 0);
    const fechaVenta = new Date(body.fecha_venta);
    const fechaFormateada = `${fechaVenta.getDate().toString().padStart(2, '0')}/${(fechaVenta.getMonth() + 1).toString().padStart(2, '0')}/${fechaVenta.getFullYear()}`;
    let pdfDefinition = {
        content: [{
                columns: [{
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUcAAAESCAYAAABuChcvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADUSSURBVHhe7Z0LfBTV2f/ZkAQhCIIoKlaChILctVRAsEmKiIoXlBaV9m2IpNW/WF/xpbRSFIIUUfoRKqK1bxCiVCyKooKC4psERBShGsQLEiQoeOGSAIZrAvyfXziT7s6e2Z2Zndk9s/N8P58fzJns3M95znPugZMnTzZiGIZhQmHjyKhMmvgf1Ir/GSYusHFk4k5dXV1mTU1NZnl5ebbY1aiioiJz06ZNmevXr8985513MsXuEAYOHFiJ//v06VP/f/fu3ev/z8rKqmzXrt32Nm3aVJ5xxhml2McwscLGkXEdGMPKysqcnTt3tl+yZEnOrFmzcsSfHAcGdNSoUaXZ2dllbCyZWGDjyDgOjOGaNWvysJ2TkzO5fmeCgLGEpzls2LDSXr16lbGxZMzCxpFxjLKysklue4axAmM5derU+QMGDChOTU2tL5YzjAw2jkxMaF5ioj1EOxQVFc1H8TsrK2u+2MUw/wHGkcWyqtra2kwyLvMQhbwu8ia3lZaWTpI9J8u/Ys+RsQSKzhMnThxl1KLsZbTGnLy8vEIucjNsHBlToPicm5tbkoxGUY9WL0lF7kKxi/EhbByZiHi5TjFW2Ej6GzaOjCEoQvvRKOpBww0Xtf1HivifYRqAtzh27NgSNoynKCgoGIUqBWQWYhfjA9hzZEJgbzEyKGqXlJTksheZ/LDnyNTD3qI50CDFXqQ/YM+R8VVLtJOUlpZO5saa5IWNo8/Zt29fTqtWrUpEkLEIGmtGjx6dL4JMEsHFah+DoiEbxthAY83ll1++Dd632MUkCWwcfcrcuXPncf2iM2j1kGwgkws2jj4EDS/weESQcQBuqEk+uM7RZ8AwqjylmNdBV5/XXnstn+eN9D5sHH0EG8b4wH0hkwM2jj6BO3fHFzaQ3oeNow/g7jqJAQZy9erVHUSQ8RjcIJPksGFMHGikQa8AEWQ8BnuOSQwbRjXgkTTehI1jkoI+d2lpadtEkEkwbCC9Bxerk5Q//OEPXJxTCCwtAU9eBBkPwJ5jElJRUTGqU6dObBwVgxtovAUbxyQkEAjwR1UULl57By5WJxno6C02GQVB8ZrHYHsD9hyTCD+1TqOIKjYb9enTp367e/fuDfs2bdpUb4DWr1+fqdo8lffcc0/pzJkzc0WQURQ2jkkEps5KtglrYQSxlnRWVlZlu3bttrdp06bS7rhlzWOrqanJ3LNnT2ZZWVn2/PnzcxLxzrZs2ZJPzzRfBBkVgXFkeV9FRUVogEFO52mRMdxWWlo6qbq6Okf2nG6otrY2E9cjgzUqXu8Rz4nryu6HpYakO1neEhK2LAF6QYkwhtGkGUu3DSXOL7s+Sw1Jd7K8pXvuuQf1jGGJT2VpRlH2PCoJhtJNj1KlTIEVKulOlneExCtLdCrKKwbRSJqhdDIzYu9RXUl3sryjeNWRxSKvG0WZnDKSeDey87MSL+lOlnekT2wqKRmNol5OGMlkf0delXQnyxtCopIltkTLD0ZR39Ici5Fk71FNcT9HD6Niv0Yyip4dHod+kFofyJ07d7bHvoqKisxoHcrJuDV0Prf7Pci4cr9H1dBbS5Y3BE8Fn08VwfvxWsur1sACLxf3L3uueIm9R/Uk3clSX4lOzMHyShFaJWMoE3frUUvSnSx1pVLCxn2onqBhEFU1hnqhzlL2DKzESLqTpZa0BC5LUImS6glZxXdmRjDiuG/cv+y5WPGTdCdLDamawHFPsvtVQfEY9hcPwUjiObionThJd7ISKxhFVRO4iolVy0S8UHS2I3jpbCTjL+lOVmKERB5rh2K3pGr9oheLznaFb4AGJdl7YDkv6U5W/KVyIlfRMKqckbgtPDeeX/ZeWM5JupMVP6meyGEYZfedSPnJWzQSvovKdb/JIOlOVnykeiJXzTDCe8U9ye7Vr8L7YC/SHUl3styVFxK5SoYRiV/WQIV71KT/m5+E52cv0nkF8A8TP8rKyibl5ORMFkFlIQOea3etFqfRFsNv3rx5ZWpqasM4ZiNka8UgjDHSs2bNStqF9clIVpaUlOSaeUeMCfTWkuWevNL/TsVWaacELxRCq28y9IfUC15kMn+/eEq6k+W8vNKy6reEFWwsk6X1m4vZzki6k+WckPC8kug4QZ36XngPXjeUbCBjl3QnyxkhoSGSyiKvaoIxkD2Dn6UZStn78orYQNoXN8i4BBoRWrVqBe/DE5Ah6MAV+XLQwLNmzZo8LzSkySAD6dkJiBOK3lqyYhfq7fBqnZSbHihX4JuT5kl6pTQQLNyz7JlYxpLuZNkXEpAscsYqt1pWcV7Zc7CM5dXiNledWJN0J8u+3KjId7Pbif7+WeblRSPJmaF5SXey7MmtFk6c2w3jyMVpZwQj6aWiNjfSmFMKvSzGAcaOHVvixugL8hrz8b+2Ap5TkCEvVWUEjNdBQxZGpqDhQ+xSmokTJ47SRh0xEZBZTJY1uVm00q7htFfKXqM78ooXiXvEvcqegXVK7DnGCHJgt7p4aF6j01ARfT57je7gFS8S62vn5uZ6pqtZQpBZTJY5udFlJ1jB13LSc2SPIT7yQmMN4pXs3lnsOcZEYWEhIr8rwLsTm46C83Jn7/iAjteUEXUQQSVBPfncuXPR2MfokVlMVnShew1en1vSe3dOtVaz1xh/4Z2rXA+Je+M66HCx52iTTp06uZbbUmQNm7cwKysrZm+PvcbEoNVD4ruKXUqB+kc3S0GeRWYxWZHllBdnJHil+ms64amyd5BYqe5ByuKdnyXdyTKW240wkKzoG+t1YdD152TFX/i2bg0WiFUw3LJ79qu4WG0Rt4sf6JztRtE3Ozu7TGwyCQTfdsaMGfkqFrFRvObGmSBkFpMll9uNMJBR0QYeh+z3ZqU/HyuxUrWIjXvi6pdTku5kyaWPSG5IVqSGYjGOXKRWU7FmeG6J+z6eUgD/MNGJ16qB9D0CYjOMQCBg62ORJ6DMSoJMKJhINy0tDR6kUnCcacR1jmbBYH2x6RroaiM2paA+Umxagg2juqAOUsWhhty1h42jKSoqKkahsloEXSNaX8Zhw4ZZNnLRDC6TeDCSxm7G5xYYOeP3mXvYOJpgzpw5eWLTVdq1a7ddbErp1auX5RZnbqX2Biq2YC9evDgu8V5VuM4xCvGsE6qNssiVnXuJdk5GHVSrf4SxXr16tdJjw92EPccoFBcXx63uJZoRw9+tFr/YMHoHfCuV6h9RlYQqJRH0HWwco1BQUBCXyGG2btBKvSPXN3qPAQMGFKtU/5ifn+/bhhk2jhGIZ65pdmIJK/WOXN/oPeA9Tpo0SZk1puE9+rVhho1jBOKZa0ZrjNFo3ry56WJyZmamUi2gjDnQ9Uolr9+vDTNsHCMQj+47VrFT78h4j7y8PGW8x/nz57PnyPyHeFdEt2nTxrRHaLbekRtjvAu+3RaX1hCyil+L1mwcDSgrK8sWm3HBSnEZlfZi0xBujPE+qBZRpe9jeXl5XNODCrBxNEDlogQXrf0BvvO8efOUKF4vWbLEd54jdwI3wO4kD3aJNOGEDBRzWrVqZbi0JopkWVlZ7D16HFU6hvuxQzh7jhK80PEVLZrsPSY/qtQ9+rHekY2jhHjXN9plzJgxUeseGe+jSpcsv9U7snGUEO/6RruV7pESjZXWb0Zt4D2q0MDmt3pHNo4SVOzfKAOJRsW5ABnnGT58eMJLCevXr/dEunAKbpDRUVdXd0FaWpqp0SpOYrVBRsOowp5n40k+xo4dW4J5FkUwIVC8ak/x6isRTGrYc9Rx6NChC8SmJ1ClyMW4j53Jjp3Ga+kjFtg46qiqqkrIx4cHKDYto9JQM8Y9zHT+Z5yDjWMSAO9RlaFmjHvgOye6+1ainIdEwMZRx3ffffcjsRlXampqYqrsRofv4IQT6/kYNUl00TpR6SMRsHHUsX37ds/mjFiHRGwySYqddYQYe7BxVAQnOtii2KV17dmzZw97jkmIlQlK3MDLzoNV2Djq2Lx5c0I+vlMdbFWbZp9xlkTXOyYqfSQCNo46Pv74Y09/fCQeTLO/c+fO9mIXk2So0KXHD7BxVAQnRx9gUgru9pG8JPLbet15sAIbR0XAkMVY+jrqgQcpNhmGsQEbRx09evRI2NAo7n6TvDg5DR4yPlVmCE9m2DgqhF9XefMLc+fOnSc2Y6ZPnz4JMY6JdB7iDRtHhfDrKm9+oaCgYJRTE8YmqlGmc+fObBz9SiI/vl9XefMD2vya1113nSPeo9l1zhn7sHHU0b59e9/kjEz8QQZYVlY2SQRtk6jJjP2UPtg4KkZhYWHMCYdRj+CRLRMnToy5eJ3okTJ+gI2jjnPOOedrsZkQ/Dbbsh+B9+jVTDDR6SOesHHU0bp164QWG7je0R9gRm8vrHLpZ9g46mjWrFnC61S4aO0P8vPzbX/nRHXyT7TzEE/YOCoIF639gRdLCSo4D/GCjaMOypG/SvSsNk61aDLqYDT6KZZSQiJGySB9iM2kh42jBBVmPUGLpthkkhjUPXrFe/TbQm5sHCWoMNsyN8wkF5EmH/bKsNHs7GxfzULOxlGCKn3IuGHGH9gdNooMVGzGhczMTF/NI8nGUQJaAlWYTdtLRS4mMpEmH/ZKHXOiWsgTBRtHA1SZbZm9x+SgoqIiopdntY7Zybk/zeC3+sZ6Tp48yZKouroaHttJFYR7kd0jyzsaOHDgNtm3DZaV7xzv+Llly5ZRsvtIZrHnaIBKY1fZe/Q+ZuoHVf7OfqtvBGwcDVCl3hHwUDN/YKXzf7yX3vVbfSNg4xiBMWPGKLNIVSxDzZjEYjZjU7X7li/rGwk2jhFQqSiBhOPkNPuMmpSXl2eLzYiUlZWZ+p0TDB8+3JcrWbJxjACKEirlmugPx117vMecOXNMd/JesmSJUt8XVUtY6lcEfUUArTKMMegykZaWhpZGJcB42tWrV3cQQcYDBAIB04nM7Pe1cs5Y2LJlS35WVhYXq5lwVGqYAVy89hZWG9LM1DvGs4+jXw0jYONoApUaZgBWsePWa28QaWSMEdHqHSsrK+NS9PZrQ4wGG0cTqNjHC63X8R4lwVjHTh1itGPi1RiTl5dXKDb9ib5XOEuu0tJSdKVpGDGggjDqQnavLHWk/2ZmFO27mhltE6vIa5wnu7afxA0yJlGtYUYDRZ/Ro0fniyCjEKj66NSpk6364dra2g5GHa/j0RhTXV2d69dWag0uVpsEERUtdyKoDKh/5AYaNXGj43486pr93H0nBL0ryTIW5eaZFHFK8NpUE4r9sntmJUaxTgxhNAkFiruy3zspKxNgJLOkO1nGivdsKFbEBlIdxWrEjAyU2/WNHIf+I+lOVmTFI/e2IyQcjtxqKFYjJpsiDPtkv3VK0RqC/CbpTlZkoXgti1yqiA1kYuWEEZN9Q7czZS5Oh4obZGygauOMRk5OzmRe2jVxuDWDEhrfxKbjcCNMOGwcbYKO4SoNK9TDBjIxoDXZzMS20aDzhJzD7VbqGTNmcHcwHWwcbQLvUfUIBQM5duzYEh5JEz+szMATiU2bNoV8MzdHxVARfrJRn0pfIytrs8zL7UpyJ4SKdq5Pcl9OxgV0GdPO62Ydd/B1WKGS7mRZEyrPZRFPJXFLtvtysg9scMuxWw0x3DodWdKdLGtCzq5q9x69kIBxv7LnYNmX0yUIzaNz02vk0kRkcZ2jA6C+BjOYUIRWvrUPi3Xl5uaWcGONs9gdQx2N4uJiV74TGUbfj52OisxisuwJuTyKKnitXhDulb3I2OVkcVoTSiJueY3wcmXPwQoVe44OAg+ypKQkVwSVB11O2IuMDczaDW9cBB3FDa8RLdN+nt3bEjKLyYpNXmjB1osbbOzJDa8RcqMEotVjssxJupMVu7xoICE2kubllmF0Q2wYrUu6k+WMvFYHGSzNSHKdpFxo6ZW9NxXFhtGepDtZzsnLBhLCvaNxgCvx/yO3GkrcEJcC7Eu6k+WsvG4gNWmG0u/947xSnOYMLTZJd7KcFwykVzqKm1GwR+knY+kVw8gdvGOXdCfLHcFAopgji8xeV7CxTFaD6YXMDd+BDaMzCuAfJr5g+inM+efE1FaqQ4m1sk+fPpXdu3evn/UlKyur/v927dptx/9t2rSp3LNnT2bw4vfadF3Dhw8vVmUUB/qCYpYjEVQSvGv0s+UZdhxCby1Z8VEye5GxSjXvB56w7D5VEje8OC/pTlb8BCMAYyCL8H6Uaokc30d2n6oIdaDIaGX3zopN0p2s+Iq9SDUTucoeIzJU9hbdlXQnKzGCcfCbF4nnhRGSvY9ESuXMijt1x0fSnazECQYSxsIrXUbsSmXPR9VWabwzbomOn6Q7WWoIhjLZjKTqxUEV37eq3nWyS7qTpZaSoU4SRkflBK5iRoRvjvuS3S/LfUl3stSU14yk5iWqnsBVanhR3bP2k6Q7WWpLpcSsl5a4vZLAVfIW2SiqJelOltqCJyZLXImQ14yhJtX6l6IRSHafrMRJupOlvhLRogpj4lVjqAkZi4qt0dwKrZ54bLVHqaury0xLS4PnYxkqSpaOGTOmGNsY06yNZQ4e94wxz9hu3rx5ZbKM1VV1fDS+x8yZMz2z9pBv0FtLlncUS30ZPEC/dA9RfYgme41qSrqT5Q0hUckSmxXBaCRr4kTRX2WjCOH+ZPfOSrykO1nekVOtrclkJL1gFDVx5251xXWOHgdzQ3bq1AkNDI5ARqVy6tSp83v16lWmylyKZkAd7Jo1a/JUn3NRD6W/gNhkVCPYUrK8J7S+uuUl4bzwwlTtxI378pKXqJdXW/z9IvYckwCnvUcZ8CjnzZtXiFbsRHmU8A5ramoyy8vLs5csWZIza9Ys1Ll6Fkp77DUqDBvHJGHs2LEl8TIWMJTa0gfZ2dllbhnMZDOGwVRXV+d6qdrCj7BxTBJgSOz2e3SCYIOJMPpMBq8Tg//RZxL/Axg9sdkIa8jgf/S5hBHEdjIZQj3cr9EbsHFMIuJRvGZip7a2tgMvgqU+KeJ/JgnIzMwshVcigoyCoDjNhtEbsOeYZCS6eM0Yw8Vpb8HGMQnxwhrLfoSL096Ci9VJyIABA4q5eK0WW7ZsyWfD6C3YOCYhSIQzZszIRwuy2MUkEGRUWVlZ80WQ8QhcrE5iuP4x8XA9o3dh45jkcPeexAHPffXq1R1EkPEYXKxOclCcKy0t5caZOAPDWFJSwh6jh2HP0SdwC3Z84eGB3oc9R5+AFmz2IOMDG8bkgI2jT0ALNnfxcR82jMkDF6t9BlqwvTgprBdgw5hcsOfoM+BBZmdnF3IR2znQ+MKGMflgz9HHcCNN7HB3neSFPUcfAw8S4315JI09UH/LhjF5Yc+Rqa+HzM3NLXnnnXcaJqBlIoNqCWQuIsgkIWwcmXpgIIuLiycVFBSMErsYA7h+0R9wsZqpBw01eXl53FATAW548RdsHJkGtJZs1EOykfwPMIp4H6hfZMPoH7hYzRjCdZFct+hn2HNkDIEnickT/OhFakVoNoz+hY0jExG/FbW5CM1ocLGasUSyDj+EUZw6dep89hQZDTaOjC1gJCsrK3PmzJmT5+UF+IuKiuYPHz68mL1ERg8bRyZmvNZHkr1ExgxsHBnH0IrcS5YsyVHNm4RB7NOnT+WYMWOKebErxgxsHBlXgKGsqanJLC8vz06EsYQxHDVqFFb9q+zVq1cZF5sZq7BxZOKC28ZSKypjG5P6opW9/g8MYxM2jkzCOHHiRFux2ejYsWNnHzp0qD584MCBs6uqquq3d+/effZZZ521q3Xr1t8j3KJFi13NmjWr305PT9+VkpJSv80wTsPGkWEYRgJ3AmcYhpHAxpFhGEYCG0eGYRgJbBwZhmEksHFkGIaRwMaRYRhGAhtHhmEYCWwcGYZhJLBxZBiGkcDGkWEYRgIbR4ZhGAlsHBmGYSSwcWQYhpHAxpFhGEYCG0eGYRgJbBwZhmEksHFkGIaRwMaRYRhGglvLJOC8rffv39+joqLiJ2vXru2zbdu2tq+++mqvrVu3tha/adSxY8eq66+/vrxbt27bL7744o1ZWVnrTj/99E2BQGC/+AnDJIqMmpqaHhRff7pq1arLNm/e3G7x4sW9v/vuu9PF3xsNGTJk8yWXXLK9V69eFX379l1z3nnnbUhPT99Kf6o79QvG08A4OqRAbW1t5nvvvTc+Pz//PZzargoLC1/bvn37LSdOnGghuQ6L5Zaa7N69+6qHHnro5XPOOeeALG5GU//+/SuXLFny6OHDh7vT+VJ052d5SNKdFpVy8ODBS2bPnv2cLLLEIkS0DRs2jKVrZOiuyWI5qZS9e/dekZeXt04WD+0KmTzSBp2/voTmoJpQSWwknfsnkr+xjJXx6aef/u7YsWNZkr+FSbrTrOApPvXUU8WyiOGkEGkReemanBOzHBWVTlo///zzc2TxzgnBA129evVEulZT/bVtKABjC6OLc+/fv3+A5DescDVkfr/85S8/Onr0aGfJb8Ik3WlCKV9//fUv4dnpI4NbQiRDkZ2u3UR3LyyWLVHm3n7y5MlLZfHNaT355JPPHD9+/CzZfZgRjn399denBxf32ThGl96Bs2Ic7TTINHn//ff/e9iwYRODK6eNIAO6fcSIEe9feuml5ZmZmZ81a9asWvyp0b59+86rqKjoumLFin4LFiy41Mz5SktLJ2dnZz9Cm4dP7WEY65DH2Pbhhx9+asKECTeIXYbceuutH/bs2XP7gAED/p2WlnZM7G5E3siZq1atupg8w05r165tL3YbQh7qEzfffPN42jx4ao85qqqqBo0cOXIOpZPOYlc9ZBwHtmjRYo0IMjq2bt2aN2TIkEeDG4HJOJaTrbk5PT19s9hljN5aRlGTd9999z4cFkl0Q5+jrhA5Mx1jtiicsWvXrqu1IkMkffjhh/9Nv3e6HoflH6WSMfujLG5pQh16dXV1DhnRlpLj9UpBXEecR9yXnU8TORZ/oN831h0fUdu2bfuV7FzsOUYWZVz369+ZW8XqqBEKEeOLL77Ip9/G0oASUq8iE4rzHDFYdlVTU9PHqEoIiWfPnj2D6Xe26rfJmLZ68803/2LU2o3r4vqyY43ExtGe4mYcKcJcGal7A3Laurq6H8mOtSOKZKcvX778Idm1oEcffXQRIqLsWBYrghq//fbbU2RxCl3QRBcc2XFWlLp58+bRRull8eLFf6PfmK47Z+NoT3ExjqjUvOOOO97RX0gTckr6nRvdbQyL8Yh433777Q2SY1gsQ6H4e/vtt6OeLiw+wQGQHWNTqUgX+utAQ4cO/fTIkSPdJMdIxcbRnmI1jmaGD6a+9957v/773/8+QIRDQCXz4MGDp9GmpUpmkxzt16/f38lLfEGEG0DjzbJly4bRZsapPQwTHTIoP37qqacuE8EGpk6duvjMM890snGjLjc3t4i80fdFuAGKtxdt3bp1oAgyihLVOFIO13X69OkjRTCEadOmvUKWGEUUNwxjPYFAoPq22257vHfv3t+KXQ08/vjjQw4ePNhNBBkmKvv27TtXbIbQv39/jOpyNB6npqZWUtxFV6EwPvzww4vpv6anQoyKRDOOjalY+wvkdCLcALrojBkzZkZKSsr3YpdrtGzZ8v37778/zHv86KOPzv3888+RAwdO7WGYyHzzzTfSLjfNmjWrEZtOcrJnz54lVGT/QYQb2LhxY8cTJ040F0FGQSIax7q6ugsWLFhwpQiGUFhY+M8WLVqEFRlc4mhOTs6rskhWWlra/+TJky1EkGGUIiMjY9stt9yyQQQb2LZt21mUvhr63zEKoq+EDBZa3PATvaxWKDuh48ePt5k4ceIbwfeB1sW1a9f+iXLgM2XHWFCAzn8OJh0oKSmZjFETt95667+DrwVhH/721ltvTf3222+vxzE4Vncu05JVGKPyXfLbAHoCfPLJJ7c/9thjC4P70qFryKRJk5bhXDU1NT+l36bqjjVSKn6P4yZMmLC8Y8eOe7Vz4jmLiormYfIPesazJcc6ofp3jveI4Xtjx479v+B7wDb2LV269JHvv/9+qFM9E/AOtWsEa8WKFdPo75b6H5oRel1gdAze6X333bcCk1rgnf/73/++R8Qf/TFNySH5u+wezcpmQ00qGioo/o3E9xg/fvxb+u5OaLSi0uIqxMEPPvjgf8R1bDfE4npoIAm+hqzBpLa29gIMwdTSJOIGuvrhHaKxmH4TgA1APA4+lxXJrtuwoZf2UWUnstoVwSEFMHxw4cKFT4jEAoMYa0fwDEQGfHDZc5oRPlJVVVUunctyvzgTxjFw6NChXlYm9cCzHDhw4DIcG3SeYFmaZAEJAsPWKCHbHvqmUwrel5nO/sHCfWAYmJjIwfYYe/RhlJ0fiYMy/Itkx8RZcTWOMDyIh3pDaFYwVC+99NIsYaSk1zCSCeOYWlFRkRecacqEePHDDz/0jZtxPHz4cM/Bgwd/ITsRcnvZMR5Sys6dO2+68cYbN8qez47s9POMYhybbNy4cUy0iCETDEl5eflddI4QL5IyFNuTLKArlzBMDeezKop8XawaRZmefvrpuQZeV1RRIu5gNKVerOOfHVJcjCOcH/T3tBO/ZEKcgzdJ5zY9wUYU4xiA44LzBv/dSCgRxM04IpHKToI+YhTBMCxQepwHlGHU/yxWIdFZ8T4iGMcM5Mb6v1kRIhUiF52r3oPEN4t1kgWrzxekADIju96JTIjM5CGjvll2vUhq8uqrr/5Vdk4IRV8xgiVRM0C5bhyPHTvWCc8pOzZWIfOla5gqakcyjtXV1dlm4wviJTLueBnHxqiDkZ2kuLj4f+nvzXS/94piNjrRBBefcmVTk/TKjCOKEdGGaZqV9sHJG2o7bdq0JbLfWNWiRYtm071bmX4r5csvv/y1WQ/AipB4kIgk14yoSMMHNaF6ApkLfct4j8JKr6ysvBVxQBN5tM/K7hHfIvh3mmD8JOetF+JDpAEdTuizzz77LV0rapWXkXHct2/f5dOnT38peH8kwVbRd2pJ3uMdwe9h0qRJy/S/7d279zfLli17OPh3kKwOOORmNeFCf/3rX9F1JuTEEEasyI7xgAJIpLJngrS6E+S69JLa0O+Di6QpSCSUO/0kWv0MjIDZkRYy41hQULBWb0hwPfxWDG1LF8fXV0KTR3ZjpPrDl19+eabMEwmaWAGJX4vITVGdUlRU9LSRMUPkIuNyqfh9NEUtGqFqAxOJoLhLvw82uunYh8wiUp2wTW82gGvKzifTuHHjViLx6N5/3GRUirNStyiU8cwzz/xDdi5I+xZ4n7AB9PtgA5eOTBZxGw5ApG+KhrS6urp2QcdKJTOOuIfnnnvuyeB9kYT72Lt37yDZ+WXpS+YhGkm6E0Uw2RAraPv27TfLjlFd9EyGQyCRS1Fue6HsOANlrFu3bpxRBME0+fSbqIlI9vH0eu2112ZEqwejiNw6UqQPFiKHiEyRcvYUNHoZZQJi8taongESmVH9Hs6NzIp+Z6Zhr37ma6MZb2yOs7dVisA3h7HEt4NxEkZEdn7H5JRxxHBbWZzFPjwP/cZ0yzPSU6SGQjPtEjLjKBOMMTJtOkZLU+nIqMrKyh6I9O1dMY50cBejxgobuZUKCqxfv/5e2fOguIkcUXJMNBnOUnTPPfeUUM55nuSYEEUzjjg//c5U1xwYomgRzaKXFUDxSHYelCpMGAXDujNRR2R5in8kCCNja7Yop1NTGHqjTM6s0MVk5cqVD4q04fgcA04YRxgQo6KqlXgWLKQbo+oaM12johlHlOaQKdJvI9X/nkaSfndXjCNeuv6kVk+sklBM1veRhFBE3Ldv389kx5gRnfdc9AfTnxcZCzIY2THBimQcrdRdChnWE0Pw1KzWz8HAw9Drz/XrX/96fbR1OOCdyowO4hAZuR6yY8wIXTZkHq3ZopxEjq4fg2dGX0axQJwj9ZVOGEf8VvY9HnzwwVcoHtvuy2r0nc20TUQzjrHO2xqrcfTFutU1NTWdi4qKwibOuOuuu1a0bNkybPSCWVJSUnYNGjToAxFs4OWXX+5BHtqZImgZjCO/+eab5wYCAUQ6sxzv2bMnvCopVBR85YwzzjD8u4zGjRtX9evX71MRbICK3C0oQTUTQRlNSktLr5fN7D5lypQ5p5122iYRtEzz5s3XPfHEEzNFsIGZM2fmfv311zkiaIUTrVu3Xjl//vzcjRs33kVF9+gzREcAz3zfffcNa9++/cLzzjtv+wsvvDCbiqAX0p8SOcQ1QM+WK/seI0aMeBXxWAQtQ+nnM9kIoM2bN6Nbm+2x4+R0rKT4vIg2YdQSgtQ4VlVVZYrNpGDHjh3dZRHj6quvRp+7WCYbON6mTZvdYtsxyDNb06JFi3IRNA0Zv8rBgwdvEcEQsrOz0Y3n6KmQaY5QAv9ObDfw1ltvdSLP0XBJC/pb5vPPP58tgg0gwv/4xz/WuhPZ5WTXrl2XkwcQ9n7WrFlzOf1nN0Ee7NGjx5zly5dfTB52LkYIUbGuSvzNFohzZHzuuuCCCz564403HiJjkZDhgnTd5ps2bfqxCDaQn5///oUXXvh/ImgLMqwHzz///D0i6BjXXXddGZ07LO7Fk4R4jgcOHBhAXtFJp/TnP/95OUUAQ0+tS5cuL6P4TLlZASXsv0yePHkZFRdLybB9In5iG/I6bOe6RvTt27ecnsuK11gPRaajZCAPiWADZGw3kLHdJoKWOPPMMy0/H2Wunclj6iWCDTgV4dPT07+64YYbwrzg1atX96Ci9dkiaJfD9A5LR48efVtFRcW5VOroS8WzB+6+++4y8XfLwEhec801f7zzzjtfPXTo0CVid9yguHTwtttu+wtamjds2HAvZVxPjB07toS85A2pqakxfQ869zEqVqMjuaNcdNFFmLchYV4jkBrH008/3fEEn0hQbCD3fzV5LXOvuOKKiZMmTboWxTBTi+wkAPI04P05FjGysrK+o0RgKwLbmK0m8Pnnn0sNgIMR/jCdK+zbPfXUU5cdPHgw6kJXFjiWkZGx7vLLL3/wb3/7G7o9nbF///6Bdo0l5kSl+PcSZdRhXrXLnEBcp4zurUsuuWTmzTffPObRRx/9Of6nvym3UB1KBWSDvhLBhCE1jmlpaWHeB9MA+jyetXfv3itffPHFx0aOHInRNo5CnssOsekIZBx3UA5/RARdBUU4Mo6oYwsBxX0yNI5Nb0de/zdiMwTyjlyrEqJ3uB+r/WnGkp61meZZoogqfhaRtWvXtv/d7373tyNHjvQUu7xIOnnoHb788sv/mj59+nPjxo2Tzvdql06dOn1HNsjxorpVpMaRPK3j5CqHTQ9GxZYLjx071koEkx10bWh1+PDh3rt27Rr67rvvTpg6deorl1122ZeNGzfeRYlzBeVwv0dkF793BBgRyuXD3r2HSP/666/Diraop2zatCmqC6RVI1bVvn3758WpQzCar9ElDmue5dNPP90PXVu2bt36mzFjxqwWf5eCKocnn3wSfUVVT0tNyRFoi2qwysrKkcuWLXvkrrvuWnXuuefuIeP1ZceOHZ9B45OsPj8WunbtWknfOOEOmtQ4UuKspg/+pQg2gJdw9OhRR1+EAmBUSG/t4//xj398iwwgPk4tZRJVVKz8sG3btksHDBjwl/vvv/96p42hHtQZou5QBD1HbW1tmy1btpwjgnGHviUaZBqfCsUXVN9ceOGFzz7++OM55FH+tLCwUDoLOLj33nt/uX379mtEMJGgq8yZ+/fvv3zTpk13zp07d54wgAdgoMgR+K5ly5bvdOjQ4Z/XXnvtH+bMmXO508ZQVYyK1Xvg2opgCN9//31Ykckq5EHsIiPzJ6tatGjR4+IUsZKK3PAf//hHMUWC72EAtY//yCOPXEHXiqf3wTjI7t270SKcfiqUME6QR7n+gQceGEGlrftlpTCwePHiYWSYWopgXKHrtoBDQIYQjWR7KFNehdb6goKCUYk2gO3atYPtiUs1UCSkxpFyjIM9e/bcKoIhkFfQmf6LKfKR8d3Sr1+/h61qyJAh0qKUBTA/4iVTpkx5Gbnh7bff/ptYIsGNN974MVq+RZBh9BweOHDgdCpGPyLCISxYsGAAebpZIhgvmsAoXn311evgEMAQiv22oGL1m3l5eWF9fWOBvNXj9F9CW6qB1DgSR8hzrBDbIaxfvx6D0r24LEHqF198cVvHjh1L0Vot9lkC/d6wEiJm/8DY0pdeeqk3RYyF4s+Mwhw9evSiDz74YBzqjmfPnr1wwoQJK6666qrPP/30U8wM7iZ1/fv3n4euMyLcANZA2rNnT9yMI3mLrZ999tnZMIorVqyAk2MZdJJHVyAqQV5LdqD1tGnThg0ePBgzdCcdRsYRLZzrZMUBjDTBiBMR9AoByi1HZGdnzzTjKeK5UalOzzr/448/HoM+khhiVVFRcRZF8hFdu3Z9KjU1dTv99MSpI5hoYNotZKqUQFHH5Zp+9atf3UGXC+ueUl1d3enSSy+dgbrju++++5aHHnroShiIHTt2oArF1TpK8oS+uemmm6SdrXfu3BlzNZVJMhYtWvTgb37zG4yXjwoZ9O3otL906dIZGL5IJa6L6fudvnz58i7oAnT22WcvoxJmtfh5UmJoHJs3b765oKAgbB1fGBfyHofQZkIqve2AZQNGjhw5zcgwIjdcuXLlVPRhQ2747bfftnz88cd/Nnr06Pzu3bs/gT6SKSkpGAkTZgyrqqpi7XScVJAh+KFdu3ZhiUa0YCesLrBZs2bSfp6U+WHuQ7dXATx5/vnnbxPbIdTV1aWKTTdpvG7dujtvueWWO0U4jHHjxr2NBpkjR450pffRjDzszIcffnjw0KFDx2dmZj7XtGnTj8gYhvV5pd+mU7qyPVRWZQyNIxmDvcOGDcOkCmEsWLDgSvqoF4ig6mS88MILBbJGFhSTUdSm3LDXoEGD7kcfNpEbmq7vOHjwIC+vGQTFG4wwCRuS+dlnn51XW1t7lgjGndNOO22PbMgheY+9qMid1A1w9HxdpkyZki+CIdxxxx1r0LI+Y8aMwd26dXuySZMmn9FuKx3DU8lBSMrWa0PjSJzs0qXLKrjXItzAvHnz+lIucz1tKr9eNBUHumDxfxFsAEVn8hZ/36lTp/kUtNt1Jp0ihl/6fZoCjXm9e/fG2kMhYDIOeldh43vjRVpa2nd9+/YNG3eO/peffPLJFbTpalw+fvy4tKRlZ3imVej5rpStPY+O67NmzfotWtYpaKsBhJ6r+d69e31nHLHm7seYzUUEQ5g4ceLt5IL3EEFlqays7IOKbxFsoLCw8OX27dvHNAkCFSmaVlRU/EgEmVMcowxHOiyTimqD6L8mp0IxEcAY4d/+9rdrp0+f/jK6y1AJYDT66tE3kRbxyGgfwJh1EQyhqKjoJioJuek9NikvL/+J2A6hbdu2Yf2JnYTex+lUpL5YBEMYP378XPIUMYGwbY4dO9bm/fff7yCCSUVE40gcHTJkyLMy7xE50cyZM6ecOHGirdilJJSrSesE+/TpgzoUy5M7BIPiGIplIsgIMjMz12PaNRFs4Omnnx5M7yzm1lkYMhg0Uj+M0PjZz342pXPnzkXoq0feqdHEDicvvvjiN2X3hTHPb7zxxl206YThDoOciM54dhFsAJ5by5Ytpb1CHEQ6Ygnv4YILLtDWZreNkfORDEQzjvAePyIv658iGMKECRNueOGFFx6gzYxTe7yDA7PppK5fv/56FMtEOIR9+/adLzZ9R9OmTSsw7ZoINoAM9c0330TdVyxGKLBp06YbYNBEuAG0rrZq1cpwrkiKy59gDk8RDOF3BHlYd9Om0w0kGa+88srtsmLttdde+35qaqp0jLjbkHe/i65tdVKREMgxOofS/3UiGMJXX33VhjIxT1c5RTWORN3Pf/7z+imORDgEtIC9+OKLmKvO1XoHfIjFixffJoIxQzkejJrteiYyfgMoMRaIYBh0v/FohVQS8sj3Dx8+HNPnhwEjRO9+OG3aevfoVnXnnXeOFcEQRowY8UZK5CnRDv7iF7+YJ/Me0ZOBit2PUEngQafiMs5D55soayXGPQwaNGgxbdoeKlpbWxtpwuGIYHz34cOHYyn1pVJmkjd58uShIhwClRAwN4FyPVoo/jSjtGkqczZjHNE9Y+cDDzxQKCteA0zA8OCDDz537NixLmKXk2Rs2bIl/5prrim9jRD7TGNU4f2vf/3rCrv1TD/88EN/zKzCwwyNoSLbWxQnXhXBBmCE0K1qx44dv6CgqfinQQnuonvvvRfLaoa9d7RE9+jRQ1uK0xAqxr47e/bsJ0QwjKuuuupPVNx9G5ONUNCuh1s/EgtpAucT+0KYMmXKc3QvpmbyOe2006TDDymhmynOHvvRj34kTQOrVq1Co6qdZ0zduHHjHTfeeOOfRVhJqKQQ5hmjpEfx6AwRjAxZd7OKusxmx44d92LB/OPHj58rOd6S0On6o48++v0QgxXngoXFvCk3OFN2HizkRLk0ii5hxy1cuPAJOu502XEGavLFF1/k4zll5wsWOs5Kjg9RrGtc6IXjcLz+nFjoiv5uZa3pBsWyfklVVdXPjd494tHrr78+nb5zxJUVhVL27NkzWPZsmqwssEXXNLWON9YCEsvGZtJx0Ragql8qF6vuFRYWYoZ56TkhrIIpzik7T5jwrmXnMbs43IYNG+Bphx2PbyBWgIy0gFWI8L2wcL/sfMEyE4+N4ivShez3VmUUd3H/9PeoC6FJd0ZQ6ubNm0dHMpAQ/o4ForAuMh1jejU2ilytsCQolnyMdg1NiGg1NTV96HijhJFRVFQ0T3YshIgsjjeMILgvZAxWFmFChJSdK1jJbhxJhis0atIyVPoGl9J7Dl4rORUJ34yxMRvZg4V3ZWVxe9wnFvHCtfBMmsgTmUpFy6VmMnEIv0PVgOyejETF356DBw9G96iw82FN702bNv0/pDVN9N6w7nrD8UeOHOk2dOhQrAUUdnxQJhXJoUmhUuGFWArVjGMAIVOMtsKk28YRGar+3JoQp7Zu3fpf2jsTA0BCHKWQk5lUYOfOnTdREdtwYXu9sFD90qVLH4FhDf6IMIRY/xnGC8tbyo41Ej4qEpX+gWSC8Yt2v4i0jz322MI1a9ZM0CJ+tPtCRMHvZIvOl5SUTKZrR/RkfGAcoSbvvvvufbJzOKEYltatX58dhk12XjeEb3PgwIH+snuJpDqDVSCNJFkzOgAPWPbbYCGdBht/xE+sThgp7SCD+eCDD/5H9rdomYDbxjFSpqKXzJiHnMyK6MG6RMvR3RKuSw9yCd2HqWIUKWqVgFXhHg4dOtQbxvnJJ598Rv937ItmuH1iHKEmqCJx8v1DeMco5kmuZ1r4Rshknb43vbBmNIyx7B5MqPHbb789RXZemT755JPbJefIMFMcNivN46T319rICBncR4PcNo6kiKVGveBpBh8ffCI7agKjY7ZIEavgoWGNYbqu6TqSIMHjvTHWe0UuKorMWjFOul60GSPnI+MIBeDBjxs3bqXsfFYEj118A1vPJFEAma3RovexCPWWlZWVt9I1muiuaUkwrGa9R8RHOka2oH7GypUrH4w1I9CnQyPPNlq8i4NxrG9zMJvm9cY85ER2RblHi40bN45xw0jiQ6L+UhRH7BjFEKEifNGiRbOtRhBE8vLy8rvoWcMaflCMkR2DagT9b4PlM+OoqQmqU+wYSRhFeCv0DS+QnNcJBRA/Vq9ePTGWuIy4hYX9d+3adTWd0ykDXm8gzRjwKKWWlKqqqlw0YsqOjSSUlnbv3n0VnUNv6NOXLFnyqP73qOdEfafutw2Kh3GEkPGZqV/WZyphJ4pRTVGXSK7s02YrbmXSIhe8Uio2nS25TsyiyFPf+IO6UFS0B98vro/cES45DBwiJR1jaJjp7x3y8/OxVGjIc6C+JtL9+9Q4agrQuzkHGQu+wfjx49/S122hvhfx4L333huPBhs6Jl13DjeVAo8IxgDXR3207B4h1NVp94n3QnELDUuyczqhVFwDCRlxVJbJ4z5NVDekIF4jfiOe4xmCz4HnxHnwbZBOkF4k52gQ2iGCj9eE+mb6u8yLjZtxFGpKxeYrUbWgf1ZNxcXF/0u/a6YdU19n5xKpFLnO37Fjx2UVFRVd16xZ05s+xHkLFy4MGedJCeDDzMzM3QMGDCjv1q3bR+eee+6HTZo0QQRUbslIhmH8g5vGkWEYxrNYGqHAMAzjDxo1+v/xRHfxVnyOBQAAAABJRU5ErkJggg==',
                        width: 150,
                    },
                    [{
                            text: 'Factura',
                            color: '#333333',
                            width: '*',
                            fontSize: 28,
                            bold: true,
                            alignment: 'right',
                            margin: [0, 0, 0, 15],
                        },
                        {
                            stack: [{
                                    columns: [{
                                            text: 'Factura No. ',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: body.id_venta, // Valor del número de recibo
                                            bold: true,
                                            color: '#333333',
                                            fontSize: 12,
                                            alignment: 'right',
                                            width: 100,
                                        },
                                    ],
                                },
                                {
                                    columns: [{
                                            text: 'Fecha:',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: fechaFormateada,
                                            bold: true,
                                            color: '#333333',
                                            fontSize: 12,
                                            alignment: 'right',
                                            width: 100,
                                        },
                                    ],
                                },
                                {
                                    columns: [{
                                            text: 'Estado',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: 'PAGADO',
                                            bold: true,
                                            fontSize: 14,
                                            alignment: 'right',
                                            color: 'green',
                                            width: 100,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
            },
            {
                columns: [{
                        text: 'De',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 14,
                        alignment: 'left',
                        margin: [0, 20, 0, 5],
                    },
                    {
                        text: 'Para',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 14,
                        alignment: 'left',
                        margin: [0, 20, 0, 5],
                    },
                ],
            },
            {
                columns: [{
                        text: 'GameStart',
                        bold: true,
                        color: '#333333',
                        alignment: 'left',
                    },
                    {
                        text: body.nombre,
                        bold: true,
                        color: '#333333',
                        alignment: 'left',
                    },
                ],
            },
            {
                columns: [{
                        text: 'Dirección',
                        color: '#aaaaab',
                        bold: true,
                        margin: [0, 7, 0, 3],
                    },
                    {
                        text: 'Ciudad',
                        color: '#aaaaab',
                        bold: true,
                        margin: [0, 7, 0, 3],
                    },
                ],
            },
            {
                columns: [{
                        text: 'Pasaje \n El Oro \n   Ecuador',
                        style: 'invoiceBillingAddress',
                    },
                    {
                        text: body.ciudad,
                        style: 'invoiceBillingAddress',
                    },
                ],
            },
            '\n\n',
            {
                width: '100%',
                alignment: 'center',
                text: 'Factura No. ' + body.id_venta,
                bold: true,
                margin: [0, 10, 0, 10],
                fontSize: 15,
            },
            {
                layout: 'noBorders',
                table: {
                    headerRows: 1,
                    widths: ['*', 80, 80],
                    body: [
                        [{
                                text: 'Descripción',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'Cantidad',
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'Total Item',
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        ...body.productos.flatMap(item => {
                            const esDigital = item.tipo.nombre === "Digital";
                            const clavesDelProducto = esDigital ? item.claves_digitales || [] : [];

                            return [
                                [{
                                        text: item.nombre + ' (' + item.plataforma.nombre + ') ',
                                        margin: [0, 5, 0, 5],
                                        alignment: 'left',
                                    },
                                    {
                                        text: item.cantidad,
                                        margin: [0, 5, 0, 5],
                                        alignment: 'right',
                                    },
                                    {
                                        text: `$${item.importe}`,
                                        fillColor: '#f5f5f5',
                                        alignment: 'right',
                                        margin: [0, 5, 0, 5],
                                    }
                                ],
                                ...(
                                    esDigital ?
                                    clavesDelProducto.slice(0, item.cantidad).map(clave => [{
                                            text: clave,
                                            margin: [10, 2, 0, 2],
                                            colSpan: 3
                                        },
                                        {}, {}
                                    ]) : []
                                )
                            ];
                        }), [{
                                text: 'TOTAL',
                                fillColor: '#eaf2f5',
                                bold: true,
                                alignment: 'right',
                                margin: [0, 10, 0, 5],
                                colSpan: 2
                            },
                            {},
                            {
                                text: `$${body.total_venta}`,
                                fillColor: '#eaf2f5',
                                bold: true,
                                alignment: 'right',
                                margin: [0, 10, 0, 5],
                            }
                        ]
                    ]
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 10, 0, 5] // [left, top, right, bottom]
            }
        }
    };

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Factura</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Factura</h2>
                <p style="text-align: center;">Adjunto a este correo encontrarás tu factura en formato PDF.</p>
            </div>
        </body>
        </html>
    `;

    try {
        const pdfBuffer = await generatePdf(pdfDefinition);
        let config = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'gamestartstoreec@gmail.com',
                pass: 'bdcq adgp qcqv lstb', // Asegúrate de usar una variable de entorno para información sensible
            }
        });
        const opciones = {
            from: 'GameStart',
            subject: 'Factura de Compra',
            to: body.correo,
            text: 'Adjunto a este correo encontrarás tu factura en formato PDF.',
            html: htmlContent,
            attachments: [{
                filename: 'factura.pdf',
                content: pdfBuffer,
            }]
        }
        config.sendMail(opciones, function(error, result) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: error,
                });
            } else {
                res.json({
                    ok: true,
                    msg: result,
                });
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor del correo" });
    }
}

module.exports = {
    enviarCorreoPrueba
}