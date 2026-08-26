import SwiftUI

struct DrawerView: View {
    let receipts: [Receipt]
    var onTap: (Receipt) -> Void

    var body: some View {
        Image("HisTray")
            .resizable()
            .aspectRatio(900 / 759, contentMode: .fit)
            .shadow(color: Color(red: 80/255, green: 50/255, blue: 20/255).opacity(0.18), radius: 16, y: 10)
            .overlay {
                GeometryReader { geo in
                    ForEach(receipts) { receipt in
                        Button {
                            onTap(receipt)
                        } label: {
                            Image(receipt.imageName)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: geo.size.width * receipt.pos.width)
                                .shadow(color: .black.opacity(0.28), radius: 3, y: 2)
                                .rotationEffect(.degrees(receipt.pos.rotation))
                        }
                        .buttonStyle(.plain)
                        .position(
                            x: geo.size.width * receipt.pos.x,
                            y: geo.size.height * receipt.pos.y
                        )
                    }
                }
            }
    }
}
