import SwiftUI

@main
struct AvaApp: App {
    @StateObject private var store = AvaStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .preferredColorScheme(.light)
        }
    }
}
